module.exports = {

  attributes: {

    // What event will trigger this hook
    event: {
      required: true,
      type: 'string',
      isIn: ['playerConnected', 'playerDisconnected', 'chatMessage']
    },

    commandsToExecute: {
      required: true,
      type: 'string'
    },

    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

    server: {
      model: 'sdtdserver',
      required: true
    },

  },

};
