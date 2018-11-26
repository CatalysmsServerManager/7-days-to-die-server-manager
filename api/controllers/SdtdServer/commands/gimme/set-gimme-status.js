module.exports = {

  friendlyName: 'Set gimme status',

  description: 'Set the enabled/disabled status for the gimme command',

  inputs: {
    serverId: {
      type: 'number',
      required: true
    },

    status: {
      type: 'boolean',
      required: true
    },
  },

  exits: {
    success: {},
  },


  fn: async function (inputs, exits) {

    await SdtdConfig.update({
      server: inputs.serverId
    }, {
      enabledGimme: inputs.status
    });
    sails.log.info(`Set status of gimme to ${inputs.status} for server ${inputs.serverId}`);
    return exits.success();

  }
};
