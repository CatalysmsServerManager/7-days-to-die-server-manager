const Sentry = require('@sentry/node');

module.exports = async function handleItemTrackerUpdate(data) {
  // Server auth data gets stripped when JSON'ified through bull so we got to get the data from DB again
  const server = await SdtdServer.findOne(data.server.id).populate('config');
  const { trackingInfo } = data;
  const config = server.config[0] || {};
  const { bannedItemsEnabled } = config;

  const bannedItems = (await BannedItem.find({ server: server.id }).populate('tier')).filter(_ => _.tier);

  if (!bannedItemsEnabled) {
    return 'bannedItems hook is not enabled';
  }

  for (const onlinePlayer of trackingInfo) {
    try {

      if (!onlinePlayer.inventory) {
        sails.log.warn('HOOK:bannedItems - onlinePlayer does not have inventory property', { playerId: onlinePlayer.player, server });
        continue;
      }

      if (!Array.isArray(onlinePlayer.inventory)) {
        onlinePlayer.inventory = sails.helpers.safeJsonParse(onlinePlayer.inventory, [], { serverId: server.id, playerId: onlinePlayer.name });
      }


      const unionOfSets = bannedItems.filter(bannedItem => onlinePlayer.inventory.find(inventoryItem => inventoryItem.name.toLowerCase() === bannedItem.name.toLowerCase()));
      if (unionOfSets.length) {
        const isImmune = await sails.helpers.roles.checkPermission(undefined, server.id, onlinePlayer.player, undefined, 'immuneToBannedItemsList');

        if (isImmune.hasPermission) {
          sails.log.debug(`HOOK:bannedItems - banned items detected but player is immune player ${onlinePlayer.player} from server ${onlinePlayer.server}`, { playerId: onlinePlayer.player, server });
          continue;
        }

        for (const bannedItem of unionOfSets) {
          const bannedItemRole = await Role.findOne(bannedItem.tier.role);
          const player = await Player.findOne(onlinePlayer.player);
          let playerRole = null;

          if (player.role) {
            playerRole = await Role.findOne(player.role);
          } else {
            playerRole = await sails.helpers.roles.getDefaultRole(server.id);
          }

          if (bannedItemRole.level < playerRole.level) {
            sails.log.info(
              `Detected banned item(s) on player ${onlinePlayer.player} from server ${onlinePlayer.server}`, { player, server }
            );
            await executePunishment(onlinePlayer.player, server, bannedItem);
          }
        }
      } else {
        sails.log.debug(`HOOK:bannedItems - no banned items detected from player ${onlinePlayer.player} from server ${onlinePlayer.server}`, { playerId: onlinePlayer.player, server });
      }

    } catch (e) {
      Sentry.captureException(e);
      sails.log.error(`HOOK:bannedItems - Error while checking player ${onlinePlayer.player} from server ${onlinePlayer.server}`, { playerId: onlinePlayer.player, server });
    }
  }
};

async function executePunishment(playerId, server, bannedItem) {
  const player = await Player.findOne(playerId);
  sails.log.info(
    `Punishing ${player.name} with id ${player.id} for having a bad item in inventory.`,
    { playerId, server }
  );
  await sails.helpers.sdtd.executeCustomCmd(
    server,
    bannedItem.tier.command,
    { player: player, bannedItem }
  );
};
