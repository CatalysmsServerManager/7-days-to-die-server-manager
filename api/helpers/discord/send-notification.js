module.exports = {
  friendlyName: 'Send Discord notification',
  inputs: {

    notificationOptions: {
      required: true,
      type: 'json',
    },
  },

  exits: {},

  fn: async function (inputs, exits) {

    if (!inputs.notificationOptions.serverId) {
      return exits.error(new Error(`Must specify a serverId in options to send notification`));
    }
    if (!inputs.notificationOptions.notificationType) {
      return exits.error(new Error(`Must specify a notificationType in options`));
    }


    sails.helpers.getQueueObject('discordNotifications').add(inputs.notificationOptions);
    return exits.success();
  },
};

