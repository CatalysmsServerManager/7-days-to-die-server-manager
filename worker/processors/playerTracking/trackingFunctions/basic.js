module.exports = async function basicTracking(server, onlinePlayers, playerRecords) {
  let dateStarted = new Date();
  for (const playerStats of onlinePlayers) {
    if (playerStats.steamid) {
      // Load the current player data
      let player = playerRecords.filter(playerInfo => playerInfo.steamId === playerStats.steamid);

      let statsUpdate = {
        zombieKills: playerStats.zombiekills,
        playerKills: playerStats.playerkills,
        ip: playerStats.ip,
        deaths: playerStats.playerdeaths,
        score: playerStats.score,
        level: Math.trunc(playerStats.level)
      };
      // Update with the new data
      player = player[0];
      if (_.isUndefined(player)) {
        return;
      }

      await Player.update(player.id, statsUpdate);

      // Detect if player killed any zombies
      if (player.zombieKills < playerStats.zombiekills && player.zombieKills !== 0) {
        let zombiesKilled = playerStats.zombiekills - player.zombieKills;
        sails.log.debug(`Detected a zombie kill! ${player.name} of server ${server.name} has killed ${playerStats.zombiekills} zombies in total. - Detected ${zombiesKilled} kills`);
        player.zombiesKilled = zombiesKilled;
        await sails.helpers.getQueueObject('kill').add(player);
      }

      // Detect if player killed any players
      if (player.playerKills < playerStats.playerkills && player.playerKills !== 0) {
        let playersKilled = playerStats.playerkills - player.playerKills;
        sails.log.debug(`Detected a player kill! ${player.name} of server ${server.name} has killed ${playerStats.playerkills} players in total. - Detected ${playersKilled} kills`);
        player.playersKilled = playersKilled;
        await sails.helpers.getQueueObject('kill').add(player);
      }

      // Detect if player leveled up
      if (player.level < Math.trunc(playerStats.level) && player.level !== 0) {
        let levels = Math.trunc(playerStats.level) - player.level;
        sails.log.debug(`Detected a level up! ${player.name} of server ${server.name} has leveled up to ${Math.trunc(playerStats.level)}. - Detected ${levels} levels`);
        player.levels = levels;
        // No processors for this, so disabled for now
        //await sails.helpers.getQueueObject('levelup').add(player);
      }

      // Detect if player gained score
      if (player.score < playerStats.score && player.score !== 0) {
        let scoreGained = playerStats.score - player.score;
        player.scoreGained = scoreGained;
        // No processors for this, so disabled for now
        //await sails.helpers.getQueueObject('score').add(player);
      }
    }
  }

  let dateEnded = new Date();
  sails.log.verbose(`Performed basicTracking for server ${server.name} - ${playerRecords.length} players online - took ${dateEnded.valueOf() - dateStarted.valueOf()} ms`);

  return;
};
