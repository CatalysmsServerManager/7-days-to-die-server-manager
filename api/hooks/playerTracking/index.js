/**
 * playerTracking hook
 *
 * @description :: A hook definition.  Extends Sails by adding shadow routes, implicit actions, and/or initialization logic.
 * @docs        :: https://sailsjs.com/docs/concepts/extending-sails/hooks
 */

module.exports = function definePlayerTrackingHook(sails) {

  return {

    /**
     * Runs when a Sails app loads/lifts.
     *
     * @param {Function} done
     */
    initialize: function (done) {

      sails.log.info('Initializing custom hook (`playerTracking`)');
      return done();

    },

    start(serverId) {

      let loggingObject = sails.hooks.sdtdlogs.getLoggingObject(serverId);

      if (_.isUndefined(loggingObject)) {
        sails.log.warn(`Tried to start logging for a server without a loggingObject`, { server: serverId });
        return
      }

      loggingObject.on('memUpdate', async (memUpdate) => {
        let server = await SdtdServer.findOne(memUpdate.server).populate('config');

        await basicTracking(server, loggingObject);

      })

    },

  };


  async function basicTracking(server, loggingObject) {
    let stats = await sails.helpers.sdtd.loadPlayerStats(server.id);

    for (const playerStats of stats) {
      if (playerStats.steamId) {
        sails.log.verbose(`Received stats - Performing basic tracking for a player`, playerStats)
        // Load the current player data
        let player = await Player.findOne({ server: server.id, steamId: playerStats.steamId });
        // Update with the new data
        await Player.update(player.id, playerStats);

        // Detect if player killed any zombies
        if (player.zombieKills < playerStats.zombieKills) {
          let zombiesKilled = playerStats.zombieKills - player.zombieKills;
          sails.log.debug(`Detected a zombie kill! ${player.name} of server ${server.name} has killed ${playerStats.zombieKills} zombies in total. - Detected ${zombiesKilled} kills`);
          player.zombiesKilled = zombiesKilled;
          loggingObject.emit('zombieKill', player);
        }

        // Detect if player killed any players
        if (player.playerKills < playerStats.playerKills) {
          let playersKilled = playerStats.playerKills - player.playerKills;
          sails.log.debug(`Detected a player kill! ${player.name} of server ${server.name} has killed ${playerStats.playerKills} players in total. - Detected ${playersKilled} kills`);
          player.playersKilled = playersKilled;
          loggingObject.emit('playerKill', player);
        }

        // Detect if player leveled up
        if (player.level < playerStats.level) {
          let levels = playerStats.level - player.level;
          sails.log.debug(`Detected a level up! ${player.name} of server ${server.name} has leveled up to ${playerStats.level}. - Detected ${levels} levels`);
          player.levels = levels;
          loggingObject.emit('levelup', player);
        }

        // Detect if player gained score
        if (player.score < playerStats.score) {
          let scoreGained = playerStats.score - player.score;
          sails.log.debug(`Detected score gain! ${player.name} of server ${server.name} has achieved a total score of ${playerStats.score}. - Detected ${scoreGained} score points gained`);
          player.scoreGained = scoreGained;
          loggingObject.emit('score', player);
        }
      }
    }

    return 
  }

};
