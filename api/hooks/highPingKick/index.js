const { classToHook } = require('../../utils.js');
/**
 * highPingKick hook
 *
 * @description :: A hook definition.  Extends Sails by adding shadow routes, implicit actions, and/or initialization logic.
 * @docs        :: https://sailsjs.com/docs/concepts/extending-sails/hooks
 */

class HighPingCount {
  /**
   * Runs when a Sails app loads/lifts.
   *
   * @param {Function} done
   */
  initialize(done) {
    sails.on('hook:orm:loaded', async () => {
      sails.log.info('Initializing custom hook (`highPingKick`)');

      let enabledConfigs = await SdtdConfig.find({
        pingKickEnabled: true
      });

      for (const configToStart of enabledConfigs) {
        this.start(configToStart.server);
      }

      done();
    });
  }

  async start(serverId) {

    let server = await SdtdServer.findOne(serverId);

    let loggingObject = sails.hooks.sdtdlogs.getLoggingObject(serverId);

    if (_.isUndefined(loggingObject)) {
      sails.log.warn(`Tried to start ping kicker for a server without a loggingObject - ${server.name}`, {
        server: serverId
      });
      return;
    }

    loggingObject.on('memUpdate', this.handlePingCheck);
  }

  async stop(serverId) {
    let loggingObject = sails.hooks.sdtdlogs.getLoggingObject(serverId);
    loggingObject.removeListener('memUpdate', this.handlePingCheck);
  }

  async handlePingCheck(memUpdate) {
    let dateStarted = new Date();

    let server = await SdtdServer.findOne(memUpdate.server.id);
    let config = await SdtdConfig.findOne({ server: server.id });

    let pingWhitelist;

    try {
      pingWhitelist = JSON.parse(config.pingWhitelist);
    } catch (error) {
      return sails.log.error(`Error parsing ping whitelist entries for ${server.name}`);
    }

    let onlinePlayers = await sails.helpers.sdtdApi.getOnlinePlayers(SdtdServer.getAPIConfig(server));

    let failedChecksForServer = 0;

    if (config.pingKickEnabled) {
      for (const onlinePlayer of onlinePlayers) {

        let playerRecord = await Player.findOne({
          steamId: onlinePlayer.steamid,
          server: server.id
        });

        if (_.isUndefined(playerRecord)) {
          sails.log.warn(`Did not find player data for ${JSON.stringify(onlinePlayer)}`);
          continue;
        }

        let whiteListIdx = pingWhitelist.indexOf(playerRecord.steamId);

        if (onlinePlayer.ping > config.maxPing && whiteListIdx === -1) {
          failedChecksForServer++;
          let currentFailedChecks = await this.getPlayerFails(playerRecord.id);

          if (currentFailedChecks >= config.pingChecksToFail) {
            await this.kickPlayer(playerRecord, server, config.pingKickMessage);
            await this.setPlayerFails(playerRecord.id, 0);
            sails.log.debug(`Kicked player ${playerRecord.id} from server ${server.name} for high ping! ping = ${onlinePlayer.ping}`);
          } else {
            await this.setPlayerFails(playerRecord.id, currentFailedChecks + 1);
          }

        } else {
          await this.setPlayerFails(playerRecord.id, 0);
        }

      }
    }

    let dateEnded = new Date();
    sails.log.verbose(`Performed maxPingCheck for ${server.name} - ${failedChecksForServer} / ${onlinePlayers.length} players failed the check - took ${dateEnded.valueOf() - dateStarted.valueOf()} ms`);
  }

  async kickPlayer(player, server, reason) {
    await sails.helpers.sdtdApi.executeConsoleCommand(SdtdServer.getAPIConfig(server), `kick ${player.steamId} "${reason}"`);
  }

  getPlayerFails(playerId) {
    return new Promise(async (resolve, reject) => {
      sails.helpers.redis.get(`player:${playerId}:failedPingChecks`).then(failedChecks => {
        if (!failedChecks) {
          resolve(0);
        } else {
          resolve(parseInt(failedChecks));
        }
      }).catch(reject);
    });
  }

  setPlayerFails(playerId, failedChecks) {
    return new Promise(async (resolve, reject) => {
      sails.helpers.redis.set(`player:${playerId}:failedPingChecks`, failedChecks).then(resolve).catch(reject);
    });
  }
}

// eslint-disable-next-line no-unused-vars
module.exports = function defineHighPingKickHook(sails) {
  return Object.assign(this, classToHook(new HighPingCount(sails)));
};

module.exports.HighPingCount = HighPingCount;
