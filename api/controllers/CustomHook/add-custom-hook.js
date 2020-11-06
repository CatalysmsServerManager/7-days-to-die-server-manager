const safeRegex = require('safe-regex');

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
      isIn: sails.config.custom.supportedHooks
    },

    searchString: {
      type: 'string',
      minLength: 5
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


  },


  exits: {
    badInput: {
      responseType: 'badRequest'
    }
  },


  fn: async function (inputs, exits) {

    if (inputs.event === 'logLine') {
      if (_.isEmpty(inputs.regex) && _.isEmpty(inputs.searchString)) {
        return exits.badInput('When using "logLine", you must define either a search string or a regex.');
      }

      if (!_.isEmpty(inputs.regex) && !_.isEmpty(inputs.searchString)) {
        return exits.badInput('You can use a regex OR a search string. Not both.');
      }
    }

    let result = await CustomHook.create({
      server: inputs.serverId,
      commandsToExecute: inputs.commandsToExecute,
      event: inputs.event,
      searchString: inputs.searchString,
      regex: inputs.regex,
      cooldown: inputs.cooldown,
    }).fetch();
    return exits.success(result);

  }


};
