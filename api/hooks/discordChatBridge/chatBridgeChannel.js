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
    this.loggingObject = sails.hooks.sdtdlogs.getLoggingObject(this.sdtdServer.id);
    this.start()
  }

  start() {
    sails.log.debug(`Starting chat bridge for sdtd server ${this.sdtdServer.id}`);

    // Bind 'this' to sendMessage functions
    this.sendChatMessageToDiscord = this.sendChatMessageToDiscord.bind(this);
    this.sendConnectedMessageToDiscord = this.sendConnectedMessageToDiscord.bind(this);
    this.sendDeathMessageToDiscord = this.sendDeathMessageToDiscord.bind(this);
    this.sendDisconnectedMessageToDiscord = this.sendDisconnectedMessageToDiscord.bind(this);
    this.sendMessageToGame = this.sendMessageToGame.bind(this)

    if (!_.isUndefined(this.loggingObject)) {
      this.loggingObject.on('chatMessage', this.sendChatMessageToDiscord);
      this.loggingObject.on('playerDeath', this.sendDeathMessageToDiscord);
      this.loggingObject.on('playerConnected', this.sendConnectedMessageToDiscord);
      this.loggingObject.on('playerDisconnected', this.sendDisconnectedMessageToDiscord);
      this.channel.client.on('message', this.sendMessageToGame);
      let embed = new this.channel.client.customEmbed();
      embed.setDescription(':white_check_mark: Initialized a chat bridge');
      this.channel.send(embed);
    } else {
      this.channel.send(new this.channel.client.errorEmbed(':x: Could not find a logging object for this server'));
    }
  }

  stop() {
    this.loggingObject.removeListener('chatMessage', this.sendChatMessageToDiscord);
    this.loggingObject.removeListener('playerDeath', this.sendDeathMessageToDiscord);
    this.loggingObject.removeListener('playerConnected', this.sendConnectedMessageToDiscord);
    this.loggingObject.removeListener('playerDisconnected', this.sendDisconnectedMessageToDiscord);
    this.channel.client.removeListener('message', this.sendMessageToGame);
    let embed = new this.channel.client.customEmbed();
    embed.setDescription(':x: Disabled chat bridge');
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
