const safeRegex = require('safe-regex');
const hooksCache = require('../../../api/hooksCache');

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

    caseSenstive: {
      type: 'boolean',
      defaultsTo: false
    }


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
      caseSensitive: inputs.caseSensitive,
    }).fetch();
    await hooksCache.reset(inputs.serverId);
    return exits.success(result);

  }


};
