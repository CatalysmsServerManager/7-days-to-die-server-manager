const SdtdCommand = require('../command.js');
const request = require('request-promise-native');

class Vote extends SdtdCommand {
  constructor() {
    super({
      name: 'vote',
      description: 'Claim vote rewards',
      extendedDescription: 'Vote at https://7daystodie-servers.com/ to claim rewards!',
      aliases: []
    });
  }

  async isEnabled(chatMessage, player, server) {
    return server.config.votingEnabled;
  }


  async run(chatMessage, player, server) {

    const apiKey = server.config.votingApiKey;

    if (_.isEmpty(apiKey)) {
      return chatMessage.reply('error', { error: 'No API key configured' });
    }

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
        sails.log.error(`Unexpected response after checking vote status: ${voteCheck}`);
        return chatMessage.reply('error', { error: 'Unexpected response after checking vote status' });
    }

  }

  setVoteClaimed(steamId, apiKey) {
    return request('https://7daystodie-servers.com/api/', {
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
    return request('https://7daystodie-servers.com/api/', {
      qs: {
        key: apiKey,
        steamid: steamId,
        object: 'votes',
        element: 'claim'
      }
    });
  }

  async awardVoteReward(player, server, command) {

    let parsedCommands = sails.helpers.sdtd.parseCommandsString(command);

    await sails.helpers.sdtd.executeCustomCmd(server, parsedCommands, {
      player: player,
      server: server,
    });
    return;
  }

}

module.exports = Vote;
