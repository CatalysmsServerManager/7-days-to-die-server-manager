module.exports = {

  attributes: {
    name: {
      required: true,
      type: 'string',
      maxLength: 250,
      required: true
    },

    value: {
      required: true,
      type: 'string',
      maxLength: 250,
    },

    preventDeletion: {
      required: true,
      type: 'boolean',
      columnType: 'tinyint(1)'
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
