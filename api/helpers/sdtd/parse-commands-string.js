const split = require('split-string');

module.exports = {


  friendlyName: 'Parse commands string',


  description: 'Takes a string of commands separated with ; and returns an array of commands to execute',

  inputs: {

    commands: {
      type: 'string',
      required: true
    },

    data: {
      type: 'ref'
    }

  },


  exits: {
    success: {
      outputFriendlyName: 'Success',
      outputType: 'boolean'
    },


  },



  fn: function (inputs, exits) {
    result = inputs.commands;

    result = split(result, { separator: ';', quotes: ['"'] });
    result = result
      .map(x => x.trim())
      // Filters empty strings
      .filter(Boolean);

    // Fill any legacy variables syntax in the command
    result = result.map(async commandToExec => {
      try {
        if (!_.isUndefined(inputs.data)) {
          if (!_.isUndefined(inputs.data.player)) {
            commandToExec = await sails.helpers.sdtd.fillPlayerVariables(
              commandToExec,
              inputs.data.player
            );
          }
          commandToExec = await sails.helpers.sdtd.fillCustomVariables(
            commandToExec,
            inputs.data
          );
        }
      } catch (error) {
        sails.log.error(error, {player: inputs.data.player});
      } finally {
        return commandToExec;
      }
    });

    return exits.success(Promise.all(result));

  }


};


