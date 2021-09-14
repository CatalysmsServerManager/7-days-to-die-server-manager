module.exports = {

  friendlyName: 'Set gimme cooldown',

  description: 'Set the cooldown for the gimme command',

  inputs: {
    serverId: {
      type: 'number',
      required: true
    },

    cooldown: {
      type: 'number',
      required: true,
      min: 1
    },
  },

  exits: {
    success: {},
  },


  fn: async function (inputs, exits) {

    await SdtdConfig.update({
      server: inputs.serverId
    }, {
      gimmeCooldown: inputs.cooldown
    });
    sails.log.info(`Set cooldown of gimme to ${inputs.cooldown} for server ${inputs.serverId}`, {serverId: inputs.serverId});
    return exits.success();

  }
};
