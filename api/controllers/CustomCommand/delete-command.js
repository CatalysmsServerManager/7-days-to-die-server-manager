module.exports = {


  friendlyName: 'Delete command',


  description: '',


  inputs: {
    commandId: {
      type: 'number',
      required: true
    },
  },


  exits: {
    success: {}
  },


  fn: async function (inputs, exits) {

    try {

      await CustomCommandArgument.destroy({
        command: inputs.commandId
      });

      await CustomCommand.destroy({
        id: inputs.commandId,
      });
      return exits.success();

    } catch (error) {
      sails.log.error(error);
      return exits.error();
    }

  }


};
