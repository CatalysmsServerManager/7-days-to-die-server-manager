module.exports = {


  friendlyName: 'Update Timeout',


  description: '',


  inputs: {
    commandId: {
      type: 'number',
      required: true
    },

    newTimeout: {
      type: 'number',
      min: 0,
      required: true
    },

  },


  exits: {
    success: {}
  },


  fn: async function (inputs, exits) {

    try {
      await CustomCommand.update({
        id: inputs.commandId,
      }, { timeout: inputs.newTimeout });
      return exits.success();

    } catch (error) {
      sails.log.error(error);
    }

  }


};

