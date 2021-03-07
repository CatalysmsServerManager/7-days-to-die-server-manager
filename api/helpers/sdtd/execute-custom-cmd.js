const supportedFunctions = ['wait', 'addCurrency', 'setRole'];

module.exports = {
  friendlyName: 'Execute custom command',

  description: 'Takes an array of commands and executes them for a server',

  inputs: {
    server: {
      type: 'ref',
      required: true
    },

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
    }
  },

  fn: async function (inputs, exits) {
    const commandsExecuted = new Array();

    if (!inputs.data) {
      inputs.data = {};
    }

    inputs.data.server = inputs.server;
    inputs.data.server.onlinePlayers = await sails.helpers.sdtd.loadPlayerData(inputs.server.id, undefined, true);

    inputs.data.server.stats = await sails.helpers.sdtdApi.getStats(SdtdServer.getAPIConfig(inputs.server));

    inputs.commands = await sails.helpers.sdtd.parseCommandsString(
      inputs.commands,
      inputs.data
    );

    for (const command of inputs.commands) {
      let commandToExec = command;

      // Check if the command matches any custom functions
      let customFunction = checkForCustomFunction(commandToExec);
      if (customFunction) {
        // These variables are created so the error handler has access to more info about where the custom function failed
        let command;
        let parameters;
        let splitArgs;
        let playerId;

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
              parameters = commandToExec
                .replace('addCurrency(', '')
                .replace(')', '');
              splitArgs = parameters.split(',');
              playerId = splitArgs[0].trim();
              let currency = parseInt(splitArgs[1]);

              await sails.helpers.sdtd.customfunctions.addCurrency(
                playerId,
                currency,
                inputs.server.id
              );
              commandsExecuted.push({
                command,
                parameters,
                result: `Adjusted currency of players by ${currency}`
              });
              break;
            case 'setRole':
              command = 'setRole';
              parameters = commandToExec
                .replace('setRole(', '')
                .replace(')', '');
              splitArgs = parameters.split(',');
              playerId = splitArgs[0].trim();
              let role = splitArgs[1].trim();
              await sails.helpers.sdtd.customfunctions.setRole(
                playerId,
                role,
                inputs.server
              );
              commandsExecuted.push({
                command,
                parameters,
                result: `Set role of player ${playerId} to ${role}`
              });
              break;
            default:
              break;
          }
        } catch (error) {
          sails.log.error(error);
          commandsExecuted.push({
            command,
            parameters,
            result: 'An internal error occurred'
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
  return sails.helpers.sdtdApi.executeConsoleCommand(
    {
      ip: server.ip,
      port: server.webPort,
      adminToken: server.authToken,
      adminUser: server.authName
    },
    _.trim(command)
  );
}
