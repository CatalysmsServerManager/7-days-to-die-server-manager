module.exports = {


  friendlyName: 'Update description',


  description: '',


  inputs: {
    commandId: {
      type: 'number',
      required: true
    },

    description: {
      type: 'string',
      minLength: 1,
      maxLenght: 500,
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
      }, {
        description: inputs.description
      });
      return exits.success();

    } catch (error) {
      sails.log.error(error);
    }

  }


};
