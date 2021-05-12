const AddCurrency = require('../../../worker/util/customFunctions/addCurrency');
const SetRole = require('../../../worker/util/customFunctions/setRole');
const Wait = require('../../../worker/util/customFunctions/wait');

const supportedFunctions = [
  new Wait(),
  new AddCurrency(),
  new SetRole()
];

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
      // Check if the command matches any custom functions
      const customFunction = checkForCustomFunction(command);
      if (customFunction) {
        const result = await executeCustomFunction(customFunction, command, inputs.server);
        commandsExecuted.push({
          command: customFunction.name,
          parameters: command,
          result
        });
      } else {
        // If the command is not a custom function, execute it as a sdtd command
        let commandResult = await executeCommand(inputs.server, command);
        commandsExecuted.push(commandResult);

      }
    }

    return exits.success(commandsExecuted);
  }
};

function getArgs(fnc, command) {
  const regex = new RegExp(`${fnc.name}\((.*)\)`);
  const res = command.match(regex);
  return res[1].slice(1, res[1].length - 1);
}

async function executeCustomFunction(fnc, command, server) {
  const args = getArgs(fnc, command);
  try {
    const res = await fnc.run(server, args);
    return res;
  } catch (error) {
    return error.message;
  }
}

function checkForCustomFunction(command) {
  for (const fnc of supportedFunctions) {
    if (command.includes(fnc.name + '(')) {
      return fnc;
    }
  }
  return false;
}

async function executeCommand(server, command) {
  try {
    let result = await sails.helpers.sdtdApi.executeConsoleCommand(
      {
        ip: server.ip,
        port: server.webPort,
        adminToken: server.authToken,
        adminUser: server.authName
      },
      _.trim(command)
    );
    return result;
  } catch (error) {
    sails.log.error(error);
    return {
      command,
      result: 'An error occurred executing the API request to the 7D2D server'
    };
  }
}
