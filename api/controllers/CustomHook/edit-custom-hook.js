module.exports = {


  friendlyName: 'Edit',


  description: 'Edit custom hook.',


  inputs: {

    hookId: {
      required: true,
      type: 'string',
    },

    commandsToExecute: {
      required: true,
      type: 'string'
    },

    event: {
      required: true,
      type: 'string',
      isIn: sails.config.custom.supportedHooks
    }


  },


  exits: {

  },


  fn: async function (inputs, exits) {

    await CustomHook.update({
      id: inputs.hookId
    }, {
      commandsToExecute: inputs.commandsToExecute,
      event: inputs.event
    });
    return exits.success();

  }


};
