module.exports = {
  friendlyName: 'Send discord notification',
  description: 'Sends a notification on discord, if the server has a notification channel configured',
  inputs: {
    serverId: {
      required: true,
      type: 'string'
    },
    message: {
      required: true,
      type: 'string'
    }
  },
  exits: {
    error: {
      friendlyName: 'error'
    },
    badChannel: {
      description: 'Could not send message to specified channel'
    },
    badServer: {
      description: 'Could not find server of config for given ID'
    }
  },

  fn: async function (inputs, exits) {
    try {
      let server = await SdtdServer.findOne(inputs.serverId);
      let config = await SdtdConfig.find({server: server.id}).limit(1);
      config = config[0];
      let discordClient = sails.hooks.discordbot.getClient();
      let notificationChannel = discordClient.channels.get(config.notificationChannelId);

      if (_.isUndefined(server) || _.isUndefined(config)) {
        return exits.badServer();
      }

      if (_.isUndefined(notificationChannel)) {
        return exits.badChannel();
      }

      let embed = new discordClient.customEmbed();
      embed.setDescription(inputs.message)
        .setTitle(`CSMM Notification - ${server.name}`);

      let notificationSent = await notificationChannel.send(embed);

      return exits.success(notificationSent);

    } catch (error) {
      sails.log.error(`HELPER - discord:send-notification - ${error}`);
      exits.error(error);
    }
  },
};
