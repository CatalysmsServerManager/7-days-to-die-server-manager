module.exports = {

  attributes: {

    // What event will trigger this hook
    event: {
      required: true,
      type: 'string',
      isIn: sails.config.custom.supportedHooks
    },

    commandsToExecute: {
      required: true,
      type: 'string'
    },

    searchString: {
      type:'string'
    },

    regex: {
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
