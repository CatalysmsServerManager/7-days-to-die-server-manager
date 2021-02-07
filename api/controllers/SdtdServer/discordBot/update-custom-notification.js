module.exports = {

  friendlyName: 'Update custom notification',

  description: '',

  inputs: {
    notificationId: {
      required: true,
      type: 'string'
    },

    channelId: {
      type: 'string',
    },

    stringToSearchFor: {
      type: 'string',
      custom: (val) => {
        if (val.startsWith('/') && val.endsWith('/')) {
          return safeRegex(val.slice(1, val.length - 1));
        }
        return true;
      }
    },

    enabled: {
      type: 'boolean'
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


    let updateObject = new Object;

    if (inputs.channelId) {
      updateObject.discordChannelId = inputs.channelId;
    }

    if (inputs.stringToSearchFor) {
      updateObject.stringToSearchFor = inputs.stringToSearchFor;
    }

    if (inputs.enabled) {
      updateObject.enabled = inputs.enabled;
    }

    await CustomDiscordNotification.update({
      id: inputs.notificationId
    }, updateObject);


    return exits.success();
  }
};
