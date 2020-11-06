const safeRegex = require('safe-regex')

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
      type: 'string'
    },

    regex: {
      type: 'string',
      custom: val => safeRegex(val)
    },

    cooldown: {
      type: 'number',
      min: 0,
      defaultsTo: 0
    },

    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

    server: {
      model: 'sdtdserver',
      required: true
    },

    variables: {
      collection: 'hookvariable',
      via: 'hook'
    },

  },

};
