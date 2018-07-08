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
      badChannel: {
        responseType: 'badRequest'
      },
      notFound: {
        responseType: 'notFound'
      }
    },
  
  
    fn: async function (inputs, exits) {
  
        await CustomDiscordNotification.create({
            stringToSearchFor: inputs.stringToSearchFor,
            discordChannelId: inputs.channelId,
            server: inputs.serverId
        });

        return exits.success();
    }
  };
  