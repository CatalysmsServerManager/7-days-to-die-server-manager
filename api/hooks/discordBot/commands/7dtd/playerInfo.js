const Commando = require('discord.js-commando');

/**
 * @memberof module:DiscordCommands
 * @name PlayerInfo
 * @description Displays information about a player
 * @param {string} steamId 
 */

class PlayerInfo extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'playerinfo',
      group: '7dtd',
      args: [{
        key: 'steamId',
        label: 'Steam ID',
        type: 'string',
        prompt: 'Specify the steam ID of the player please'
      }],
      memberName: 'playerinfo',
      description: 'Shows information about a player',
      details: "For more information see the website"
    });
  }

  async run(msg, args) {

    try {
      let sdtdServer = await SdtdServer.find({
        discordGuildId: msg.guild.id
      }).limit(1)
      sails.helpers.loadPlayerData(sdtdServer[0].id, args.steamId).exec((err, playerInfo) => {
        if (err) {
          sails.log.error(err)
          let errorEmbed = new msg.client.errorEmbed(err);
          return msg.channel.send(errorEmbed)
        }
        playerInfo = playerInfo.players[0];
        let resultEmbed = new msg.client.customEmbed();
        resultEmbed.setTitle(playerInfo.name)
          .addField('Location', `${playerInfo.location.x} | ${playerInfo.location.y} | ${playerInfo.location.z}`, true)
          .addField('Banned', playerInfo.banned ? ':white_check_mark:' : ':x:', true)
          .addField('Playtime', `${playerInfo.totalPlaytime} seconds`)

        msg.channel.send(resultEmbed);
      })
    } catch (error) {
      let errorEmbed = new msg.client.errorEmbed(error);
      msg.channel.send(errorEmbed)
    }

  }
}


module.exports = PlayerInfo;
