/**
 * gbl hook
 *
 * @description :: A hook definition.  Extends Sails by adding shadow routes, implicit actions, and/or initialization logic.
 * @docs        :: https://sailsjs.com/docs/concepts/extending-sails/hooks
 */

const sevenDays = require('machinepack-7daystodiewebapi');

module.exports = function defineGblHook(sails) {

  return {

    /**
     * Runs when a Sails app loads/lifts.
     *
     * @param {Function} done
     */
    initialize: async function (done) {

      // done before we start loading bans so it doesn't block the hook loading
      done();
      
      sails.on('lifted', async () => {

        sails.log.info('Initializing custom hook (`gbl`)');

        let sixHours = 21600000;


        refreshBans();

        setInterval(async () => {
          refreshBans();
        }, sixHours * 2)

        return

      })

    }

  };

};


async function refreshBans() {
  let dateStarted = new Date();

  let sdtdServers = await SdtdServer.find({});

  for (const server of sdtdServers) {

    try {

      let loggingObj = sails.hooks.sdtdlogs.getLoggingObject(server.id);

      loggingObj.on('playerConnected', async (connectedMsg) => {

        let foundBans = await BanEntry.find({
          where: {
            steamId: connectedMsg.steamID,
            server: {
              '!=': connectedMsg.server.id
            }
          }
        });
        let config = await SdtdConfig.findOne({
          server: connectedMsg.server.id
        });

        if (foundBans.length >= config.gblNotificationBans && config.gblNotificationBans != 0) {
          let player = await Player.findOne({
            server: connectedMsg.server.id,
            steamId: connectedMsg.steamID
          });
          await sails.hooks.discordnotifications.sendNotification({
            serverId: connectedMsg.server.id,
            notificationType: 'gblmaxban',
            player: player,
            bans: foundBans
          })
        }

        if (foundBans.length >= config.gblAutoBanBans && config.gblAutoBanEnabled) {
          let player = await Player.findOne({
            server: connectedMsg.server.id,
            steamId: connectedMsg.steamID
          });
          sevenDays.banPlayer({
            ip: server.ip,
            port: server.webPort,
            authName: server.authName,
            authToken: server.authToken,
            reason: `CSMM GBL autoban: you are listed ${foundBans.length} times on the global ban list.`,
            duration: 100,
            durationUnit: 'years',
            playerId: connectedMsg.steamID
          }).exec({
            success: async (response) => {
              await sails.hooks.discordnotifications.sendNotification({
                serverId: connectedMsg.server.id,
                notificationType: 'gblmaxban',
                player: player,
                bans: foundBans,
                banned: true
              })
              sails.log.info(`Autobanned a player for being on GBL too often`, connectedMsg);
            },
            error: err => {
              sails.log.warn(`Error auto banning a player in GBL hook - ${err}`);
              sails.log.error(err)
            }
          })
        }

      })

      await sails.helpers.sdtd.loadBans(server.id);


    } catch (error) {
      sails.log.warn(`Error refreshing ban info for server ${server.name}`, error)
    }


  }

  let dateEnded = new Date();
  sails.log.info(`Reloaded bans for ${sdtdServers.length} servers! - Took ${dateEnded.valueOf() - dateStarted.valueOf()} ms`)
}
