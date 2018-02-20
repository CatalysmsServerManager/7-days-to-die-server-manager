module.exports = {

    friendlyName: 'Set discord notification channel',
  
    description: 'Set the notificationChannelId for a SdtdServer',
  
    inputs: {
      serverId: {
        required: true,
        type: 'number'
      },
      notificationChannelId: {
        required: true,
        type: 'string'
      },
      notificationType: {
        required: true,
        type: 'string'
      }
    },
  
    exits: {
      success: {},
      badChannel: {
        responseType: 'badRequest'
      },
      notFound: {
        responseType: 'notFound'
      }
    },
  
  
    fn: async function (inputs, exits) {
  
      try {
        let server = await SdtdServer.findOne(inputs.serverId);
        let discordClient = sails.hooks.discordbot.getClient();
        let notificationChannel = discordClient.channels.get(inputs.notificationChannelId);
  
        if (_.isUndefined(server)) {
          return exits.notFound()
        }

        if (_.isUndefined(notificationChannel) && inputs.notificationChannelId != "0") {
          console.log('badhcan')
          return exits.badChannel();
        }
  
        let currentConfig = await SdtdConfig.findOne({server: inputs.serverId});
        currentConfig.discordNotificationConfig[inputs.notificationType] = inputs.notificationChannelId
        await SdtdConfig.update({server: inputs.serverId}, {discordNotificationConfig: currentConfig.discordNotificationConfig});
        sails.log.debug(`API - SdtdServer:set-notification-channel - set notification channel for ${inputs.notificationType} ${inputs.notificationChannelId} for server ${inputs.serverId}`);
        return exits.success();
      } catch (error) {
        sails.log.error(`API - SdtdServer:set-notification-channel - ${error}`);
        return exits.error(error);
      }
    }
  };
  