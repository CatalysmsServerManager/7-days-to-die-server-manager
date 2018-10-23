let SdtdCommand = require('../command.js');
const sevenDays = require('machinepack-7daystodiewebapi');
const validator = require('validator');

class Vote extends SdtdCommand {
    constructor(serverId) {
        super(serverId, {
            name: 'vote',
            description: "vote test...",
            extendedDescription: "vote extended description",
            aliases: ["track", "search"]
        });
        this.serverId = serverId;
    }

    async isEnabled(chatMessage, player, server, args) {
        return server.config.enabledVote; // server.config.enabledVote && server.config.locationTracking
    }

    async run(chatMessage, player, server, args) {

      let serversToVoteOn = server.config.voteForServerServerKey;
      sails.log.info('Voting on all servers:' + serversToVoteOn);
      if(serversToVoteOn == 'none') await chatMessage.reply('There are no server listed for voting.');
      else{
          let allServers = new Array();
          if(serversToVoteOn.indexOf(';') > 0){
            allServers = serversToVoteOn.split(';');
          }
          else allServers[0] = serversToVoteOn;

          sails.log.info('Voting on ' +allServers.length+ ' servers:' + allServers);

          for(var myKey=0; myKey<allServers.length; myKey++){
            let hasVoted = await sails.helpers.sdtd.voteForServer.with({steamId: player.steamId, serverKey: allServers[myKey], playerUsername: player.name, actionType: 'get'});

            if(hasVoted == 0){ // Not found
              sails.log.info('Server not found: ' + allServers[myKey]);
              await chatMessage.reply('Sorry but it looks like we cannot find your credentials for server ' + myKey);
            }

            else if(hasVoted == 1){ // Has voted and not claimed
              let serverResult = await sails.helpers.sdtd.voteForServer.with({steamId: player.steamId, serverKey: allServers[myKey], playerUsername: player.name, actionType: 'post'})
              if(serverResult == 0){
                sails.log.info('Unable to claim vote for ' + player.name + ' on server ' + allServers[myKey]);
                await chatMessage.reply('Sorry but it looks like we cannot claim this vote for server ' + myKey);
              }
              else if(serverResult == 1){
                sails.log.info('Vote successfully claimed vote for ' + player.name + ' on server ' + allServers[myKey]);
                await chatMessage.reply('Thank you, your vote has been claimed for server ' + myKey);

                // IF and WHEN the Currency module is active, we give the player a reward
                if(server.config.economyEnabled){
                  // I expect this error wouldn't happen on a normal Production Server.
                  /*
                    verbo: Loaded a player - 2 - Saina - server: Skellos Dev
                    debug: HELPER - loadPlayerData - Loaded player data for Skellos Dev! Took 612 ms - SteamId: 76561198167980119 [ 'Saina' ] { serverId: 1, steamId: '76561198167980119', inventory: true }
                    debug: Couldn't update players roles via discord - Error: Unknown guild ID
                    verbo: Found role Admin for player Saina
                  /**/
                  // The following two lines should be under the giveToPlayer call, but since I'm getting an error with guildId stuff related to Discord... I put it here for now.
                  let playerBalance = await sails.helpers.economy.getPlayerBalance.with({playerId: player.id})
                  await chatMessage.reply('Your balance is now '+(playerBalance+server.config.voteForServerCurrencyReward)+' '+server.config.currencyName);

                  // Give the Reward for Claiming a Vote
                  await sails.helpers.economy.giveToPlayer.with({
                      playerId: player.id,
                      amountToGive: server.config.voteForServerCurrencyReward,
                      message: 'vote - Vote For Server Reward.'
                  });
                  sails.log.info('Currency balance adjusted for voting for ' + player.name + ' on server ' + allServers[myKey]);
                }

              }
            }
            else if(hasVoted == 2){ // Has voted and claimed
              sails.log.info('Vote had already been claimed for ' + player.name + ' on server ' + allServers[myKey]);
              await chatMessage.reply('You already voted today for server ' + myKey);
            }
          }

      }


    }
}

module.exports = Vote;
