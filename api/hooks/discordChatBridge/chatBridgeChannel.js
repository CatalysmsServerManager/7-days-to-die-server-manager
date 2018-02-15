const Discord = require('discord.js');
const sevenDays = require('machinepack-7daystodiewebapi');


/**
 * @class
 * @name ChatBridgeChannel
 * @description Discord chat bridge
 */

class ChatBridgeChannel {
  constructor(textChannel, sdtdServer) {
    this.channelId = textChannel.id;
    this.channel = textChannel;
    this.sdtdServer = sdtdServer;
    this.config;
    this.loggingObject = sails.hooks.sdtdlogs.getLoggingObject(this.sdtdServer.id);
    this.start()
  }

  async start() {

    try {
      this.config = await SdtdConfig.find({
        server: this.sdtdServer.id
      }).limit(1);
      this.config = this.config[0];
      // Bind 'this' to sendMessage functions
      this.sendChatMessageToDiscord = this.sendChatMessageToDiscord.bind(this);
      this.sendConnectedMessageToDiscord = this.sendConnectedMessageToDiscord.bind(this);
      this.sendRichConnectedMessageToDiscord = this.sendRichConnectedMessageToDiscord.bind(this);
      this.sendDeathMessageToDiscord = this.sendDeathMessageToDiscord.bind(this);
      this.sendDisconnectedMessageToDiscord = this.sendDisconnectedMessageToDiscord.bind(this);
      this.sendRichDisconnectedMessageToDiscord = this.sendRichDisconnectedMessageToDiscord.bind(this);
      this.sendMessageToGame = this.sendMessageToGame.bind(this)

      if (!_.isUndefined(this.loggingObject) && this.config.chatChannelId) {

        if (this.config.chatChannelRichMessages) {
          this.loggingObject.on('playerConnected', this.sendRichConnectedMessageToDiscord);
          this.loggingObject.on('playerDisconnected', this.sendRichDisconnectedMessageToDiscord);
        } else {
          this.loggingObject.on('playerConnected', this.sendConnectedMessageToDiscord);
          this.loggingObject.on('playerDisconnected', this.sendDisconnectedMessageToDiscord);
        }

        this.loggingObject.on('chatMessage', this.sendChatMessageToDiscord);
        this.loggingObject.on('playerDeath', this.sendDeathMessageToDiscord);

        this.channel.client.on('message', this.sendMessageToGame);
        let embed = new this.channel.client.customEmbed();
        embed.setDescription(':white_check_mark: Initialized a chat bridge')
          .addField(`Rich messages`, this.config.chatChannelRichMessages ? ':white_check_mark:' : ':x:')
        this.channel.send(embed);
      } else {
        this.channel.send(new this.channel.client.errorEmbed(':x: Could not find a logging object for this server'));
      }
    } catch (error) {
      sails.log.error(`HOOK discordChatBridge:chatBridgeChannel:start - ${error}`)
    }

  }

  stop() {
    let embed = new this.channel.client.customEmbed();
    if (this.loggingObject) {
      this.loggingObject.removeListener('chatMessage', this.sendChatMessageToDiscord);
      this.loggingObject.removeListener('playerDeath', this.sendDeathMessageToDiscord);
      this.loggingObject.removeListener('playerConnected', this.sendConnectedMessageToDiscord);
      this.loggingObject.removeListener('playerDisconnected', this.sendDisconnectedMessageToDiscord);
      this.loggingObject.removeListener('playerConnected', this.sendRichConnectedMessageToDiscord);
      this.loggingObject.removeListener('playerDisconnected', this.sendRichDisconnectedMessageToDiscord);
      this.channel.client.removeListener('message', this.sendMessageToGame);
      embed.setDescription(':x: Disabled chat bridge');
    } else {
      embed.setDescription('Tried to stop chatbridge in this channel but something went wrong!')
    }
    this.channel.send(embed);
  }

  sendChatMessageToDiscord(chatMessage) {
    this.channel.send(`${chatMessage.playerName}: ${chatMessage.messageText}`);
  }

  sendDeathMessageToDiscord(deathMessage) {
    this.channel.send(`${deathMessage.playerName} died.`);
  }

  sendConnectedMessageToDiscord(connectedMsg) {
    this.channel.send(`${connectedMsg.playerName} connected.`);
  }

  sendDisconnectedMessageToDiscord(disconnectedMsg) {
    this.channel.send(`${disconnectedMsg.playerName} disconnected.`);
  }


  async sendRichConnectedMessageToDiscord(connectedMsg) {
    let connectedPlayer = await Player.find({
      steamId: connectedMsg.steamID,
      server: this.sdtdServer.id
    })
    connectedPlayer = connectedPlayer[0]
    let embed = new this.channel.client.customEmbed();

    embed.setTitle(`${this.sdtdServer.name} --- ${connectedMsg.playerName} connected`)
      .addField('Steam ID', `[${connectedMsg.steamID}](https://steamidfinder.com/lookup/${connectedMsg.steamID}/)`, true)
      .addField('Country', connectedMsg.country, true)
      .setColor('GREEN')

    if (connectedPlayer) {
      embed.addField('Playtime (seconds)', connectedPlayer.playtime ? connectedPlayer.playtime : "New player!", true)
        .addField('CSMM profile', `${process.env.CSMM_HOSTNAME}/player/${connectedPlayer.id}/profile`)
    }

    if (connectedPlayer.avatarUrl) {
      embed.setThumbnail(connectedPlayer.avatarUrl)
    }
    this.channel.send(embed);
  }

  async sendRichDisconnectedMessageToDiscord(disconnectedMsg) {
    let disconnectedPlayer = await Player.find({
      entityId: disconnectedMsg.entityID,
      server: this.sdtdServer.id
    })
    disconnectedPlayer = disconnectedPlayer[0]
    let embed = new this.channel.client.customEmbed();
    embed.setTitle(`${this.sdtdServer.name} --- ${disconnectedMsg.playerName} disconnected`)
      .addField('Steam ID', disconnectedPlayer.steamId ? `[${disconnectedPlayer.steamId}](https://steamidfinder.com/lookup/${disconnectedPlayer.steamId}/)` : `Unknown`, true)
      .addField('Playtime (seconds)', disconnectedPlayer.playtime, true)
      .addField('CSMM profile', `${process.env.CSMM_HOSTNAME}/player/${disconnectedPlayer.id}/profile`)
      .setColor('RED')
    if (disconnectedPlayer.avatarUrl) {
      embed.setThumbnail(disconnectedPlayer.avatarUrl);
    }
    this.channel.send(embed);
  }

  sendMessageToGame(message) {

    if (message.channel.id === this.channel.id && message.author.id != message.client.user.id) {
      sevenDays.sendMessage({
        ip: this.sdtdServer.ip,
        port: this.sdtdServer.webPort,
        authName: this.sdtdServer.authName,
        authToken: this.sdtdServer.authToken,
        message: `[${message.author.username}]: ${message.cleanContent}`
      }).exec({
        error: (error) => {
          sails.log.error(`HOOK discordBot:chatBridgeChannel ${error}`)
          message.reply(new this.channel.client.errorEmbed(`:x: Could not send your message to the server! Something is wrong :eyes:`));
        },
        success: () => {
          return true;
        }
      });
    }
  }
}

module.exports = ChatBridgeChannel;
