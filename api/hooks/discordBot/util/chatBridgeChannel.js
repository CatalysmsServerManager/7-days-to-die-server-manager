const Discord = require('discord.js');

/**
 * @class
 * @name ChatBridgeChannel
 * @description Discord chat bridge
 */

class ChatBridgeChannel {
  constructor(textChannel, sdtdServer) {
    this.channelId = textChannel.id
    this.channel = textChannel
    this.sdtdServer = sdtdServer
    this.loggingObject = sails.hooks.sdtdlogs.getLoggingObject(this.sdtdServer.id)
  }

  start() {
    sails.log.debug(`Starting chat bridge for sdtd server ${this.sdtdServer.id}`)

    // Bind 'this' to sendMessage functions
    this.sendChatMessageToDiscord = this.sendChatMessageToDiscord.bind(this)
    this.sendConnectedMessageToDiscord = this.sendConnectedMessageToDiscord.bind(this)
    this.sendDeathMessageToDiscord = this.sendDeathMessageToDiscord.bind(this)
    this.sendDisconnectedMessageToDiscord = this.sendDisconnectedMessageToDiscord.bind(this)

    if (!_.isUndefined(this.loggingObject)) {
      this.loggingObject.on('chatMessage', this.sendChatMessageToDiscord);
      this.loggingObject.on('playerDeath', this.sendDeathMessageToDiscord);
      this.loggingObject.on('playerConnected', this.sendConnectedMessageToDiscord);
      this.loggingObject.on('playerDisconnected', this.sendDisconnectedMessageToDiscord);
      let embed = new this.channel.client.customEmbed()
      embed.setDescription(":white_check_mark: Initialized a chat bridge")
      this.channel.send(embed)
    } else {
      this.channel.send(new this.channel.client.errorEmbed(':x: Could not find a logging object for this server'))
    }
  }

  stop() {
    this.loggingObject.removeListener('chatMessage', this.sendChatMessageToDiscord);
    this.loggingObject.removeListener('playerDeath', this.sendDeathMessageToDiscord);
    this.loggingObject.removeListener('playerConnected', this.sendConnectedMessageToDiscord);
    this.loggingObject.removeListener('playerDisconnected', this.sendDisconnectedMessageToDiscord);
  }

  sendChatMessageToDiscord(chatMessage) {
    this.channel.send(`${chatMessage.playerName}: ${chatMessage.messageText}`)
  }

  sendDeathMessageToDiscord(deathMessage) {
    this.channel.send(`${deathMessage.playerName} died.`)
  }

  sendConnectedMessageToDiscord(connectedMsg) {
    this.channel.send(`${connectedMsg.playerName} connected.`)
  }

  sendDisconnectedMessageToDiscord(disconnectedMsg) {
    this.channel.send(`${disconnectedMsg.playerName} disconnected.`)
  }
}

module.exports = ChatBridgeChannel
