const hhmmss = require('@streammedev/hhmmss');

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
    this.loggingObject;
    this.donorStatus;
    this.start();
  }

  async start() {
    try {
      this.config = await SdtdConfig.find({
        server: this.sdtdServer.id
      }).limit(1);
      this.config = this.config[0];
      this.donorStatus = await sails.helpers.meta.checkDonatorStatus(
        this.sdtdServer.id
      );

      this.loggingObject = await sails.hooks.sdtdlogs.getLoggingObject(this.sdtdServer.id);

      // Bind 'this' to sendMessage functions
      this.sendChatMessageToDiscord = this.sendChatMessageToDiscord.bind(this);
      this.sendConnectedMessageToDiscord = this.sendConnectedMessageToDiscord.bind(
        this
      );
      this.sendRichConnectedMessageToDiscord = this.sendRichConnectedMessageToDiscord.bind(
        this
      );
      this.sendDeathMessageToDiscord = this.sendDeathMessageToDiscord.bind(
        this
      );
      this.sendDisconnectedMessageToDiscord = this.sendDisconnectedMessageToDiscord.bind(
        this
      );
      this.sendRichDisconnectedMessageToDiscord = this.sendRichDisconnectedMessageToDiscord.bind(
        this
      );
      this.sendMessageToGame = this.sendMessageToGame.bind(this);

      if (_.isUndefined(this.loggingObject)) {
        return;
      }

      if (this.config.chatChannelRichMessages) {
        this.loggingObject.on(
          'playerConnected',
          this.sendRichConnectedMessageToDiscord
        );
        this.loggingObject.on(
          'playerDisconnected',
          this.sendRichDisconnectedMessageToDiscord
        );
      } else {
        this.loggingObject.on(
          'playerConnected',
          this.sendConnectedMessageToDiscord
        );
        this.loggingObject.on(
          'playerDisconnected',
          this.sendDisconnectedMessageToDiscord
        );
      }

      this.loggingObject.on('chatMessage', this.sendChatMessageToDiscord);
      this.loggingObject.on('playerDeath', this.sendDeathMessageToDiscord);

      this.channel.client.on('messageCreate', this.sendMessageToGame);
    } catch (error) {
      sails.log.error(
        `HOOK discordChatBridge:chatBridgeChannel:start`, { server: this.sdtdServer }
      );
    }
  }

  stop() {
    if (this.loggingObject) {

      this.loggingObject.removeListener(
        'chatMessage',
        this.sendChatMessageToDiscord
      );
      this.loggingObject.removeListener(
        'playerDeath',
        this.sendDeathMessageToDiscord
      );
      this.loggingObject.removeListener(
        'playerConnected',
        this.sendConnectedMessageToDiscord
      );
      this.loggingObject.removeListener(
        'playerDisconnected',
        this.sendDisconnectedMessageToDiscord
      );
      this.loggingObject.removeListener(
        'playerConnected',
        this.sendRichConnectedMessageToDiscord
      );
      this.loggingObject.removeListener(
        'playerDisconnected',
        this.sendRichDisconnectedMessageToDiscord
      );
    }
    this.channel.client.removeListener('messageCreate', this.sendMessageToGame);
  }

  async sendChatMessageToDiscord(chatMessage) {
    let blockedPrefixes = this.config.chatChannelBlockedPrefixes.filter(Boolean);

    let messageStartsWithABlockedPrefix = message => {
      let found;
      for (const prefix of blockedPrefixes) {
        if (message.startsWith(prefix)) {
          found = true;
        }
      }
      return found;
    };

    if (messageStartsWithABlockedPrefix(chatMessage.messageText)) {
      return;
    }

    if (this.config.chatChannelGlobalOnly && chatMessage.channel !== 'Global') {
      return;
    }

    await this.channel.send(
      `[${chatMessage.channel}] **${chatMessage.playerName}**: ${chatMessage.messageText}`
    );
  }

  sendDeathMessageToDiscord(deathMessage) {
    return this.channel.send(`${deathMessage.playerName} died.`);
  }

  sendConnectedMessageToDiscord(connectedMsg) {
    return this.channel.send(`${connectedMsg.playerName} connected.`);
  }

  sendDisconnectedMessageToDiscord(disconnectedMsg) {
    return this.channel.send(`${disconnectedMsg.playerName} disconnected.`);
  }

  async sendRichConnectedMessageToDiscord(connectedMsg) {
    let connectedPlayer = connectedMsg.player;

    if (!connectedPlayer) {
      return;
    }

    let gblBans = await BanEntry.find({
      steamId: connectedPlayer.steamId
    });

    connectedPlayer = connectedPlayer[0];
    let embed = new this.channel.client.customEmbed();

    embed
      .setTitle(`${connectedMsg.playerName} connected`)
      .addFields([{
        name: 'Steam ID',
        value: `[${connectedMsg.steamId}](https://steamidfinder.com/lookup/${connectedMsg.steamId}/)`,
        inline: true
      },
      {
        name: 'Country', value: connectedMsg.country || 'Unknown country', inline: true
      },
      {
        name: `${gblBans.length} ban${gblBans.length === 1 ? '' : 's'} on the global ban list`,
        value: `[GBL profile page](${process.env.CSMM_HOSTNAME}/gbl/profile?steamId=${connectedMsg.steamId})`
      }])
      .setColor([0, 255, 0])
      .setFooter({ text: `${this.sdtdServer.name}` });

    if (connectedPlayer) {
      embed.addFields([{
        name: 'Playtime',
        value: connectedPlayer.playtime
          ? hhmmss(connectedPlayer.playtime)
          : 'New player!',
        inline: true
      }, {
        name: 'CSMM profile',
        value: `${process.env.CSMM_HOSTNAME}/player/${connectedPlayer.id}/profile`
      }]);

      if (connectedPlayer.avatarUrl) {
        embed.setThumbnail(connectedPlayer.avatarUrl);
      }
    }

    return this.channel.send({ embeds: [embed] });
  }

  async sendRichDisconnectedMessageToDiscord(disconnectedMsg) {
    let disconnectedPlayer = disconnectedMsg.player;
    if (!disconnectedPlayer) {
      return;
    }

    let gblBans = await BanEntry.find({
      steamId: disconnectedPlayer.steamId
    });

    let embed = new this.channel.client.customEmbed();
    embed
      .setTitle(`${disconnectedMsg.playerName} disconnected`)
      .setColor([255, 0, 0])
      .setFooter({ text: `${this.sdtdServer.name}` });

    if (disconnectedPlayer) {
      embed
        .addFields([{
          name: 'Steam ID',
          value: disconnectedPlayer.steamId
            ? `[${disconnectedPlayer.steamId}](https://steamidfinder.com/lookup/${disconnectedPlayer.steamId}/)`
            : `Unknown`,
          inline: true
        }, {
          name: 'Playtime', value: hhmmss(disconnectedPlayer.playtime), inline: true
        }, {
          name: 'CSMM profile',
          value: `${process.env.CSMM_HOSTNAME}/player/${disconnectedPlayer.id}/profile`
        }, {
          name: `${gblBans.length} ban${gblBans.length === 1 ? '' : 's'} on the global ban list`,
          value: `[GBL profile page](${process.env.CSMM_HOSTNAME}/gbl/profile?steamId=${disconnectedPlayer.steamId})`
        }]);

      if (disconnectedPlayer.avatarUrl) {
        embed.setThumbnail(disconnectedPlayer.avatarUrl);
      }
    }
    return this.channel.send({ embeds: [embed] });
  }

  async sendMessageToGame(message) {
    if (
      !message.author.bot &&
      message.channel.id === this.channel.id &&
      message.author.id !== message.client.user.id &&
      !message.content.startsWith(message.guild.commandPrefix)
    ) {

      const senderName = message.member.nickname || message.author.username;
      try {
        const cpmVersion = await sails.helpers.sdtd.checkCpmVersion(this.sdtdServer.id);
        if (cpmVersion) {
          let chatBridgeDCPrefix = ((this.config.chatBridgeDCPrefix) ? this.config.chatBridgeDCPrefix : '');
          let chatBridgeDCSuffix = ((this.config.chatBridgeDCSuffix) ? this.config.chatBridgeDCSuffix : '');
          await sails.helpers.sdtdApi.executeConsoleCommand(SdtdServer.getAPIConfig(this.sdtdServer), `say2 "${chatBridgeDCPrefix}${senderName}[-]" "${chatBridgeDCSuffix}${message.cleanContent}"`);
        } else {
          await sails.helpers.sdtdApi.executeConsoleCommand(SdtdServer.getAPIConfig(this.sdtdServer), `say "[${senderName}]: ${message.cleanContent}"`);
        }
      } catch (error) {
        sails.log.error(
          `HOOK discordBot:chatBridgeChannel - sending discord message to game ${error}`, { server: this.sdtdServer }
        );
        message.react('⚠');
      }
    }
  }
}

module.exports = ChatBridgeChannel;
