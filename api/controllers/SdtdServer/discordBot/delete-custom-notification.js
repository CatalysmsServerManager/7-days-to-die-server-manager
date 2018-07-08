module.exports = {

    friendlyName: 'Delete custom notification',
  
    description: '',
  
    inputs: {
      notificationId: {
        required: true,
        type: 'string'
      },

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
  
        await CustomDiscordNotification.destroy({
            id: inputs.notificationId
        });

        return exits.success();
    }
  };
  