module.exports = {


  friendlyName: 'Fill player variables',

  description: 'Fills player variables into a command string. Variables should be denoted as ${variable} in the string',

  supportedVariables: ["steamId", "entityId", "playerName", "balance", "posX", 'posY', 'posZ'],


  inputs: {

    command: {
      type: 'string',
      required: true
    },

    player: {
      type: 'json',
      required: true,
      custom: (value) => {
        if (!value.steamId || !value.entityId || !value.name || value.currency === undefined || value.positionX === undefined || value.positionY === undefined || value.positionZ === undefined) {
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

    inputs.command = replaceAllInString(inputs.command, "${posX}", inputs.player.positionX);
    inputs.command = replaceAllInString(inputs.command, "${posY}", inputs.player.positionY);
    inputs.command = replaceAllInString(inputs.command, "${posZ}", inputs.player.positionZ);
    return exits.success(inputs.command);

  }


};

function replaceAllInString(string, valueToReplace, newValue) {
  return string.split(valueToReplace).join(newValue);
}
