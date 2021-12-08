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

      if (!_.isUndefined(this.loggingObject) && this.config.chatChannelId) {
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

        this.channel.client.on('message', this.sendMessageToGame);
      } else {
        this.channel.send(
          new this.channel.client.errorEmbed(
            ':x: Could not find a logging object for this server'
          )
        );
      }
    } catch (error) {
      sails.log.error(
        `HOOK discordChatBridge:chatBridgeChannel:start`, {server: this.sdtdServer}
      );
    }
  }

  stop() {
    let embed = new this.channel.client.customEmbed();
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
      this.channel.client.removeListener('message', this.sendMessageToGame);
      embed.setDescription(':x: Disabled chat bridge');
    } else {
      embed.setDescription(
        'Tried to stop chatbridge in this channel but something went wrong!'
      );
    }
    this.channel.send(embed);
  }

  async sendChatMessageToDiscord(chatMessage) {
    let blockedPrefixes = this.config.chatChannelBlockedPrefixes;

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
    this.channel.send(`${deathMessage.playerName} died.`);
  }

  sendConnectedMessageToDiscord(connectedMsg) {
    this.channel.send(`${connectedMsg.playerName} connected.`);
  }

  sendDisconnectedMessageToDiscord(disconnectedMsg) {
    this.channel.send(`${disconnectedMsg.playerName} disconnected.`);
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
      .addField(
        'Steam ID',
        `[${connectedMsg.steamId}](https://steamidfinder.com/lookup/${connectedMsg.steamId}/)`,
        true
      )
      .addField('Country', connectedMsg.country || 'Unknown country', true)
      .addField(
        `${gblBans.length} ban${gblBans.length === 1 ? '' : 's'} on the global ban list`,
        `[GBL profile page](${process.env.CSMM_HOSTNAME}/gbl/profile?steamId=${connectedMsg.steamId})`
      )
      .setColor('GREEN')
      .setFooter(`${this.sdtdServer.name}`);

    if (connectedPlayer) {
      embed
        .addField(
          'Playtime',
          connectedPlayer.playtime
            ? hhmmss(connectedPlayer.playtime)
            : 'New player!',
          true
        )
        .addField(
          'CSMM profile',
          `${process.env.CSMM_HOSTNAME}/player/${connectedPlayer.id}/profile`
        );
      if (connectedPlayer.avatarUrl) {
        embed.setThumbnail(connectedPlayer.avatarUrl);
      }
    }

    this.channel.send(embed);
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
      .setColor('RED')
      .setFooter(`${this.sdtdServer.name}`);

    if (disconnectedPlayer) {
      embed
        .addField(
          'Steam ID',
          disconnectedPlayer.steamId
            ? `[${disconnectedPlayer.steamId}](https://steamidfinder.com/lookup/${disconnectedPlayer.steamId}/)`
            : `Unknown`,
          true
        )
        .addField('Playtime', hhmmss(disconnectedPlayer.playtime), true)
        .addField(
          'CSMM profile',
          `${process.env.CSMM_HOSTNAME}/player/${disconnectedPlayer.id}/profile`
        )
        .addField(
          `${gblBans.length} ban${gblBans.length === 1 ? '' : 's'} on the global ban list`,
          `[GBL profile page](${process.env.CSMM_HOSTNAME}/gbl/profile?steamId=${disconnectedMsg.steamId})`
        );
      if (disconnectedPlayer.avatarUrl) {
        embed.setThumbnail(disconnectedPlayer.avatarUrl);
      }
    }
    this.channel.send(embed);
  }

  async sendMessageToGame(message) {
    if (
      !message.author.bot &&
      message.channel.id === this.channel.id &&
      message.author.id !== message.client.user.id &&
      !message.content.startsWith(message.guild.commandPrefix)
    ) {

      try {
        const cpmVersion = await sails.helpers.sdtd.checkCpmVersion(this.sdtdServer.id);
        if (cpmVersion) {
          let chatBridgeDCPrefix = ((this.config.chatBridgeDCPrefix) ? this.config.chatBridgeDCPrefix : '');
          let chatBridgeDCSuffix = ((this.config.chatBridgeDCSuffix) ? this.config.chatBridgeDCSuffix : '');
          await sails.helpers.sdtdApi.executeConsoleCommand(SdtdServer.getAPIConfig(this.sdtdServer), `say2 "${chatBridgeDCPrefix}${message.author.username}[-]" "${chatBridgeDCSuffix}${message.cleanContent}"`);
        } else
        {
          await sails.helpers.sdtdApi.executeConsoleCommand(SdtdServer.getAPIConfig(this.sdtdServer), `say "[${message.author.username}]: ${message.cleanContent}"`);
        }
      } catch (error) {
        sails.log.error(
          `HOOK discordBot:chatBridgeChannel - sending discord message to game ${error}`, {server: this.sdtdServer}
        );
        message.react('⚠');
      }
    }
  }
}

module.exports = ChatBridgeChannel;
