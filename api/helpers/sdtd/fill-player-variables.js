module.exports = {


  friendlyName: 'Fill player variables',

  description: 'Fills player variables into a command string. Variables should be denoted as ${variable} in the string',

  supportedVariables: ["steamId", "entityId", "playerName", "balance"],


  inputs: {

    command: {
      type: 'string',
      required: true
    },

    player: {
      type: 'json',
      required: true,
      custom: (value) => {
        if (!value.steamId || !value.entityId || !value.name || !value.currency) {
          return false;
        } else {
          return true;
        }
      }
    }

  },


  exits: {
    success: {
      outputFriendlyName: 'Success',
      outputType: 'boolean'
    },


  },



  fn: async function (inputs, exits) {

    inputs.command = replaceAllInString(inputs.command, "${steamId}", inputs.player.steamId);
    inputs.command = replaceAllInString(inputs.command, "${entityId}", inputs.player.entityId);
    inputs.command = replaceAllInString(inputs.command, "${playerName}", inputs.player.name);
    inputs.command = replaceAllInString(inputs.command, "${balance}", inputs.player.currency);
    return exits.success(inputs.command);

  }


};

function replaceAllInString(string, valueToReplace, newValue) {
  return string.split(valueToReplace).join(newValue);
}
