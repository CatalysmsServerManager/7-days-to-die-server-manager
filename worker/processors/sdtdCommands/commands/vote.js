const SdtdCommand = require('../command.js');
const request = require('request-promise-native');

const locks = {};
class Vote extends SdtdCommand {

  constructor() {
    super({
      name: 'vote',
      description: 'Claim vote rewards',
      extendedDescription: 'Vote at https://7daystodie-servers.com/ to claim rewards!',
      aliases: []
    });
    this.voteUrl = 'https://7daystodie-servers.com/api/';
  }

  async isEnabled(chatMessage, player, server) {
    return server.config.votingEnabled;
  }


  async run(chatMessage, player, server) {

    const apiKey = server.config.votingApiKey;

    if (_.isEmpty(apiKey)) {
      return chatMessage.reply('error', { error: 'No API key configured' });
    }

    if (locks[player.id]) {
      return chatMessage.reply('voteLock');
    }

    locks[player.id] = true;

    try {
      let voteCheck = await this.checkIfUserVoted(player.steamId, apiKey);

      switch (voteCheck) {
        case '0':
          return chatMessage.reply('notVoted');
        case '1':
          await this.awardVoteReward(player, server, server.config.votingCommand);
          return this.setVoteClaimed(player.steamId, apiKey);
        case '2':
          return chatMessage.reply('alreadyClaimed');
        default:
          sails.log.error(`Unexpected response after checking vote status: ${voteCheck}`, {server, player});
          return chatMessage.reply('error', { error: 'Unexpected response after checking vote status' });
      }
    } catch (error) {
      // We're mostly interested in the finally here
      // Regular error handling can handle this
      throw error;
    } finally {
      delete locks[player.id];
    }
  }

  setVoteClaimed(steamId, apiKey) {
    return request(this.voteUrl, {
      method: 'POST',
      qs: {
        key: apiKey,
        steamid: steamId,
        object: 'votes',
        element: 'claim',
        action: 'post'
      }
    });
  }

  checkIfUserVoted(steamId, apiKey) {
    return request(this.voteUrl, {
      qs: {
        key: apiKey,
        steamid: steamId,
        object: 'votes',
        element: 'claim'
      }
    });
  }

  async awardVoteReward(player, server, command) {
    await sails.helpers.sdtd.executeCustomCmd(server, command, {
      player: player,
      server: server,
    });
    return;
  }

}

module.exports = Vote;
