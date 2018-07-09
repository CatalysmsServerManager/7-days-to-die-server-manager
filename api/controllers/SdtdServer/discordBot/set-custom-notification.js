module.exports = {

    friendlyName: 'Set custom notification',
  
    description: '',
  
    inputs: {
      serverId: {
        required: true,
        type: 'string'
      },

      channelId: {
          required: true,
          type: 'string',
      },

      stringToSearchFor: {
          required: true,
          type: 'string'
      }

    },
  
    exits: {
      success: {},
      maximumNotifications: {
        responseType: 'badRequest'
      }
    },
  
  
    fn: async function (inputs, exits) {

      let donatorRole = await sails.helpers.meta.checkDonatorStatus.with({ serverId: inputs.serverId });
      let maxCustomNotifications = sails.config.custom.donorConfig[donatorRole].maxCustomNotifications;

      let currentAmountOfNotifs = await CustomDiscordNotification.find({
        server: inputs.serverId
      });

      if (currentAmountOfNotifs.length >= maxCustomNotifications) {
        return exits.maximumNotifications(`You have reached the maximum of custom notifications! You can set a maximum of ${maxCustomNotifications} as ${donatorRole} user.`)
      }
  
        await CustomDiscordNotification.create({
            stringToSearchFor: inputs.stringToSearchFor,
            discordChannelId: inputs.channelId,
            server: inputs.serverId
        });

        return exits.success();
    }
  };
  