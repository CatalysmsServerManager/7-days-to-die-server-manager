const safeRegex = require('safe-regex');
const hooksCache = require('../../../api/hooksCache');

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

    caseSensitive: {
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
    const hookToEdit = await CustomHook.findOne({
      id: inputs.hookId
    });
    if (inputs.event === 'logLine') {
      if (_.isEmpty(inputs.regex) && _.isEmpty(inputs.searchString)) {
        return exits.badInput('When using "logLine", you must define either a search string or a regex.');
      }

      if (!_.isEmpty(inputs.regex) && !_.isEmpty(inputs.searchString)) {
        return exits.badInput('You can use a regex OR a search string. Not both.');
      }
    }

    await CustomHook.update({
      id: inputs.hookId
    }, {
      commandsToExecute: inputs.commandsToExecute,
      event: inputs.event,
      searchString: inputs.searchString,
      regex: inputs.regex,
      cooldown: inputs.cooldown,
      caseSensitive: inputs.caseSensitive,
    }).fetch();
    await hooksCache.reset(hookToEdit.server);
    return exits.success();

  }


};
