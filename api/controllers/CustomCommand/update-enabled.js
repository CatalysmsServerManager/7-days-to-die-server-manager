module.exports = {


  friendlyName: 'Update command',


  description: '',


  inputs: {
    commandId: {
      type: 'number',
      required: true
    },

    newEnabled: {
      type: 'boolean',
      required: true
    }
  },


  exits: {
    success: {}
  },


  fn: async function (inputs, exits) {

    try {
      await CustomCommand.update({
        id: inputs.commandId,
      }, {
        enabled: inputs.newEnabled
      });
      return exits.success();

    } catch (error) {
      sails.log.error(error);
    }

  }


};
