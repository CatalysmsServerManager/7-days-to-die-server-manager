/**
 * gbl hook
 *
 * @description :: A hook definition.  Extends Sails by adding shadow routes, implicit actions, and/or initialization logic.
 * @docs        :: https://sailsjs.com/docs/concepts/extending-sails/hooks
 */

const SdtdApi = require('7daystodie-api-wrapper');

module.exports = function defineGblHook(sails) {
  return {
    /**
     * Runs when a Sails app loads/lifts.
     *
     * @param {Function} done
     */
    initialize: async function (done) {
      // done before we start loading bans so it doesn't block the hook loading
      // eslint-disable-next-line callback-return
      done();

      sails.on('lifted', async () => {
        sails.log.info('Initializing custom hook (`gbl`)');
        refreshBans();
        return;
      });
    }
  };
};

async function refreshBans() {
  let dateStarted = new Date();

  let sdtdServers = await SdtdServer.find({});

  for (const server of sdtdServers) {
    try {
      let loggingObj = await sails.hooks.sdtdlogs.getLoggingObject(server.id);
      loggingObj.on('playerConnected', async connectedMsg => {
        if (!connectedMsg.steamId) {
          return;
        }

        let foundBans = await BanEntry.find({
          where: {
            steamId: connectedMsg.steamId,
            server: {
              '!=': connectedMsg.server.id
            }
          },
          limit: 100
        }).populate('server');

        // Get unique bans by server owner
        // This makes it so a ban on a network of servers is only counted once
        foundBans = _.uniqBy(foundBans, ban => ban.server.owner);

        sails.log.debug(
          `Found ${foundBans.length} total bans for player ${connectedMsg.steamId} on the GBL`, {server}
        );

        let config = await SdtdConfig.findOne({
          server: connectedMsg.server.id
        });

        let playerAutoKicked = false;
        let player = await Player.findOne({
          server: connectedMsg.server.id,
          steamId: connectedMsg.steamId
        });

        if (
          foundBans.length >= config.gblAutoBanBans &&
          config.gblAutoBanEnabled
        ) {
          await SdtdApi.executeConsoleCommand(
            {
              ip: server.ip,
              port: server.webPort,
              adminUser: server.authName,
              adminToken: server.authToken
            },
            `kick ${connectedMsg.entityId} "CSMM: You are listed ${foundBans.length} times on the global ban list."`
          );

          playerAutoKicked = true;
          sails.log.info(
            `Autobanned a player for being on GBL too often`,
            {player: connectedMsg, server }
          );
        }

        if (
          foundBans.length >= config.gblNotificationBans &&
          config.gblNotificationBans !== 0
        ) {
          await sails.helpers.discord.sendNotification({
            serverId: connectedMsg.server.id,
            notificationType: 'gblmaxban',
            player: player,
            bans: foundBans,
            banned: playerAutoKicked
          });
        }
      });

      await sails.helpers.sdtd.loadBans(server.id);
    } catch (error) {
      sails.log.warn(
        `Error refreshing ban info for server ${server.name}`, {server, error});
    }
  }

  let dateEnded = new Date();
  sails.log.info(
    `Reloaded bans for ${sdtdServers.length} servers! - Took ${dateEnded.valueOf() - dateStarted.valueOf()} ms`
  );
}
