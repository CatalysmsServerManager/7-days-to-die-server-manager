module.exports = {


  friendlyName: 'Create',


  description: 'Create custom hook.',


  inputs: {

    serverId: {
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
      isIn: ['playerConnected', 'playerDisconnected', 'chatMessage']
    }


  },


  exits: {

  },


  fn: async function (inputs, exits) {

    let result = await CustomHook.create({
      server: inputs.serverId,
      commandsToExecute: inputs.commandsToExecute,
      event: inputs.event
    }).fetch();
    return exits.success(result);

  }


};
