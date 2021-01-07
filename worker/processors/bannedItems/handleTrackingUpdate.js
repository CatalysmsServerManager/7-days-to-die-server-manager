module.exports = async function handleItemTrackerUpdate(data) {
  // Server auth data gets stripped when JSON'ified through bull so we got to get the data from DB again
  const server = await SdtdServer.findOne(data.server.id).populate('config');
  const { trackingInfo } = data;
  const config = server.config[0] || {};
  const { bannedItems, bannedItemsEnabled } = config;

  if (!bannedItemsEnabled) {
    return 'bannedItems hook is not enabled';
  }

  // config.bannedItems should be an array (cause sails parses it), but we are pretty certain at some point its not, so handle both cases
  const bannedItemsSet = new Set(Array.isArray(bannedItems) ? bannedItems : sails.helpers.safeJsonParse(bannedItems, [], { serverId: server.id }));
  for (const onlinePlayer of trackingInfo) {


    try {

      if (!onlinePlayer.inventory) {
        sails.log.warning('HOOK:bannedItems - onlinePlayer does not have inventory property', onlinePlayer);
        continue;
      }

      if (!Array.isArray(onlinePlayer.inventory)) {
        onlinePlayer.inventory = sails.helpers.safeJsonParse(onlinePlayer.inventory, [], { serverId: server.id, playerId: onlinePlayer.name });
      }

      const playerItemsSet = new Set(onlinePlayer.inventory.map(e => e.name));
      const unionOfSets = intersection(playerItemsSet, bannedItemsSet);
      if (unionOfSets.size) {
        const isImmune = await sails.helpers.roles.checkPermission(undefined, server.id, onlinePlayer.player, undefined, 'immuneToBannedItemsList');

        if (isImmune.hasPermission) {
          sails.log.debug(`HOOK:bannedItems - banned items detected but player is immune player ${onlinePlayer.player} from server ${onlinePlayer.server}`);
          continue;
        }
        sails.log.info(
          `Detected banned item(s) on player ${onlinePlayer.player} from server ${onlinePlayer.server}`
        );
        await executePunishment(onlinePlayer.player, server, config);

      } else {
        sails.log.debug(`HOOK:bannedItems - no banned items detected from player ${onlinePlayer.player} from server ${onlinePlayer.server}`);
      }

    } catch (e) {
      sails.log.error(`HOOK:bannedItems - Error while checking player ${onlinePlayer.player} from server ${onlinePlayer.server}`, e);
    }
  }
};

async function executePunishment(playerId, server, config) {
  const player = await Player.findOne(playerId);
  sails.log.info(
    `Punishing ${player.name} with id ${player.id} for having a bad item in inventory.`
  );
  const parsedCommands = sails.helpers.sdtd.parseCommandsString(config.bannedItemsCommand);
  await sails.helpers.sdtd.executeCustomCmd(
    server,
    parsedCommands,
    { player: player }
  );
};

function intersection(setA, setB) {
  const _intersection = new Set();
  for (const elem of setB) {
    if (setA.has(elem)) {
      _intersection.add(elem);
    }
  }
  return _intersection;
}
