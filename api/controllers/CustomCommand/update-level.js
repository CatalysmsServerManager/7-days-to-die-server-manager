module.exports = {


  friendlyName: 'Update level',


  description: '',


  inputs: {
    commandId: {
      type: 'number',
      required: true
    },

    newLevel: {
      type: 'number',
      required: true,
      min: 0
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
        level: inputs.newLevel
      })
      return exits.success();

    } catch (error) {
      sails.log.error(error)
    }

  }


};
