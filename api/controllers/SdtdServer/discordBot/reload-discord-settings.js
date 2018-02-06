module.exports = {


  friendlyName: 'Reload discord settings',


  description: 'Update and reload settings for the discord bot',


  inputs: {
    newGuildId: {
      required: true,
      example: '336821518250147850'
    },
    newChatChannelId: {
      example: '336823516383150080'
    },
    newNotificationChannelId: {
      example: '336823516383150080'
    },
    serverId: {
      required: true,
      example: 24
    }

  },

  exits: {
    badRequest: {
      responseType: 'badRequest'
    },
    botNotInServer: {
      statusCode: 200
    },
    invalidChatChannel: {
      statusCode: 200
    },
    invalidNotificationChannel: {
      statusCode: 200
    }
  },

  /**
   * @memberof SdtdServer
   * @method
   * @name reload-discord-settings
   * @param {string} newGuildId discord guild id
   * @param {string} newChatChannelId
   */

  fn: async function (inputs, exits) {
    sails.log.debug(`API - SdtdServer:reload-discord-settings - Reloading settings for server ${inputs.serverId}!`);
    try {

      let server = await SdtdServer.findOne(inputs.serverId);

      let discordClient = sails.hooks.discordbot.getClient();
      let newGuild = discordClient.guilds.get(inputs.newGuildId);

      if (!_.isUndefined(newGuild)) {
        await SdtdConfig.update({
          server: inputs.serverId
        }, {
          discordGuildId: newGuild.id
        });
        sails.log.debug(`API - SdtdServer:reload-discord-settings - updated discord guild ID for server ${inputs.serverId} to ${inputs.newGuildName}`);
      } else {
        sails.log.warn(`API - SdtdServer:reload-discord-settings - bot is not in server`);
        return exits.botNotInServer({
          error: 'botNotInGuild'
        });
      }

      // Handle chat channel config
      if (!_.isUndefined(inputs.newChatChannelId) && inputs.newChatChannelId != '0') {
        let chatChannel = newGuild.channels.get(inputs.newChatChannelId);
        if (_.isUndefined(chatChannel)) {
          return exits.invalidChatChannel({
            error: 'invalidChatChannel'
          });
        }
        await SdtdConfig.update({
          server: inputs.serverId
        }, {
          chatChannelId: chatChannel.id
        });
        if (sails.hooks.discordchatbridge.getStatus(inputs.serverId)) {
          sails.hooks.discordchatbridge.stop(inputs.serverId);
          sails.hooks.discordchatbridge.start(inputs.serverId);
        } else {
          sails.hooks.discordchatbridge.start(inputs.serverId);
        }
      }

      if (inputs.newChatChannelId == '0') {
        await SdtdConfig.update({
          server: inputs.serverId
        }, {
          chatChannelId: 0
        });
        sails.log.debug(`API - SdtdServer:reload-discord-settings - Stopping chat bridge for server ${inputs.serverId}`);
        sails.hooks.discordchatbridge.stop(inputs.serverId);
      }

      // Handle notification channel config

      if(!_.isUndefined(inputs.newNotificationChannelId)) {
        let notificationChannel = newGuild.channels.get(inputs.newNotificationChannelId);
        if (_.isUndefined(notificationChannel)) {
          return exits.invalidNotificationChannel({
            error: 'invalidNotificationChannel'
          });
        }
        await SdtdConfig.update({
          server: inputs.serverId
        }, {
          notificationChannelId: notificationChannel.id
        });
        sails.log.debug(`API - SdtdServer:reload-discord-settings - Updated notification channel for server ${inputs.serverId}`);
      }



      return exits.success()


    } catch (error) {
      sails.log.error(`API - SdtdServer:reload-discord-settings - ${error}`);
      return exits.error(error);
    }

  }


};
