module.exports = {

  friendlyName: 'Get custom notifications',

  description: '',

  inputs: {
    serverId: {
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

    let notifications = await CustomDiscordNotification.find({
      server: inputs.serverId
    });

    return exits.success(notifications);
  }
};
