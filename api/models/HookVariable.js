const safeRegex = require('safe-regex');

module.exports = {

  attributes: {

    regex: {
      type: 'string',
      required: true,
      custom: val => safeRegex(val)
    },

    name: {
      type: 'string',
      required: true
    },


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

    hook: {
      model: 'customhook',
      required: true
    },

  },

};
