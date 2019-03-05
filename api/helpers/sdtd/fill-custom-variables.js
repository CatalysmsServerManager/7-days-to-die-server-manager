module.exports = {


  friendlyName: 'Fill custom variables',

  description: '',

  inputs: {

    command: {
      type: 'string',
      required: true
    },

    data: {
      type: 'ref',
      required: true
    }

  },


  exits: {
    success: {
      outputFriendlyName: 'Success',
      outputType: 'boolean'
    },


  },



  fn: async function (inputs, exits) {

    let vars = findVariables(inputs.command);

    for (const variableString of vars) {
      inputs.command = replaceAllInString(inputs.command, `\${${variableString}}`, getVariableValue(variableString, inputs.data));
    }

    return exits.success(inputs.command);

  }


};

function replaceAllInString(string, valueToReplace, newValue) {
  return string.split(valueToReplace).join(newValue);
}

// Find variables denoted like ${x} and ${y} and returns an array of strings like [x, y]
function findVariables(command) {
  let startIdx = 0;
  const foundVariables = [];

  while (startIdx < command.length) {
    let x = command.indexOf('${', startIdx);
    let y = command.indexOf('}', x);

    if (y !== -1 && x !== -1) {
      // Variable found!
      startIdx = y;
      foundVariables.push(command.substring(x + 2, y));
    } else {
      // No more variables in the string, exit the loop
      startIdx = command.length + 1;
    }

  }

  return foundVariables;
}

// Input a string like "player.name" and returns the value for that (nested) property from inputs.data
function getVariableValue(variableString, data) {

  let propertyArray = variableString.split('.');

  if (propertyArray.length === 1) {
    return data[propertyArray[0]];
  } else {
    return getVariableValue(propertyArray.slice(1).join('.'), data[propertyArray[0]]);
  }

}
