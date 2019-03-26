const sdtdApi = require('7daystodie-api-wrapper');
const supportedFunctions = ['wait', 'addCurrency'];

module.exports = {


  friendlyName: 'Execute custom command',


  description: 'Takes an array of commands and executes them for a server',

  inputs: {

    server: {
      type: 'ref',
      required: true
    },

    commands: {
      type: 'ref',
      required: true
    },

    data: {
      type: 'ref',
    }

  },


  exits: {
    success: {
      outputFriendlyName: 'Success',
      outputType: 'boolean'
    },


  },



  fn: async function (inputs, exits) {

    const commandsExecuted = new Array();

    if (!_.isArray(inputs.commands)) {
      return exits.error(`Commands input must be an array`);
    }

    for (const command of inputs.commands) {
      let commandToExec = command;

      // Fill any variables in the command
      if (!_.isUndefined(inputs.data)) {
        if (!_.isUndefined(inputs.data.player)) {
          commandToExec = await sails.helpers.sdtd.fillPlayerVariables(commandToExec, inputs.data.player);
        }
        commandToExec = await sails.helpers.sdtd.fillCustomVariables(commandToExec, inputs.data);
      }

      // Check if the command matches any custom functions
      let customFunction = checkForCustomFunction(commandToExec);
      if (customFunction) {

        // These variables are created so the error handler has access to more info about where the custom function failed
        let command;
        let parameters;

        try {
          switch (customFunction) {
            case 'wait':
              command = 'wait';
              parameters = commandToExec.replace('wait(', '').replace(')', '');
              let secondsToWait;

              secondsToWait = parseInt(parameters);

              await sails.helpers.sdtd.customfunctions.wait(secondsToWait);
              commandsExecuted.push({
                command,
                parameters,
                result: `Waited for ${secondsToWait} seconds`
              });
              break;
            case 'addCurrency':
              command = 'addCurrency';
              parameters = commandToExec.replace('addCurrency(', '').replace(')', '');
              let splitArgs = parameters.split(',');
              let playerId = parseInt(splitArgs[0]);
              let currency = parseInt(splitArgs[1]);

              await sails.helpers.sdtd.customfunctions.addCurrency(playerId, currency);
              commandsExecuted.push({
                command,
                parameters,
                result: `Adjusted currency of players by ${currency}`
              });
              break;
            default:
              break;
          }
        } catch (error) {
          let result;
          if (_.isArray(error.problems)) {
            result = error.problems.join(' ');
          } else {
            result = error.toString();
          }
          commandsExecuted.push({
            command,
            parameters,
            result: result
          });
        }

        // If the command is not a custom function, execute it as a sdtd command
      } else {

        let commandResult = await executeCommand(inputs.server, commandToExec);
        commandsExecuted.push(commandResult);
      }
    }

    return exits.success(commandsExecuted);

  }


};

function checkForCustomFunction(command) {
  for (const fnc of supportedFunctions) {
    if (command.includes(fnc + '(')) {
      return fnc;
    }
  }
  return false;
}

async function executeCommand(server, command) {
  try {
    let result = await sdtdApi.executeConsoleCommand({
      ip: server.ip,
      port: server.webPort,
      adminToken: server.authToken,
      adminUser: server.authName
    }, _.trim(command));
    return result;
  } catch (error) {
    return {
      result: error.toString()
    };
  }
}

function wait(seconds) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, seconds * 1000);
  });
}
