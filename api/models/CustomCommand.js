module.exports = {
  
    attributes: {
  
      //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
      //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
      //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

      costToExecute: {
        type: 'number',
        defaultsTo: 0
      },

      name: {
          type: 'string',
          required: true
      },

      // Separated by ";"

      aliases: {
          type: 'string',
      },

      // Separated by ";"

      commandsToExecute: {
          type: 'string',
          required: true,
          columnType: 'TEXT CHARACTER SET utf8mb4'
      },

      enabled: {
          type: 'boolean',
          defaultsTo: true
      },

      delay: {
          type: 'number',
          defaultsTo: 0
      },

      timeout: {
          type: 'number',
          defaultsTo: 0
      },
  
  
      //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
      //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
      //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝
  
  
      //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
      //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
      //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
  
      server: {
        model: 'sdtdServer',
        required: true
      },

      arguments: {
          collection: 'customCommandArgument',
          via: 'command'
      }
  
    },
  
  };
  