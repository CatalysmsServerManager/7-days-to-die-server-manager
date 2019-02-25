const sdtdApi = require('7daystodie-api-wrapper');

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

    player: {
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
      if (command.includes("wait(")) {
        let secondsToWaitStr = command.replace('wait(', '').replace(')', '');
        let secondsToWait;

        secondsToWait = parseInt(secondsToWaitStr);

        if (secondsToWait < 1) {
          return exits.error(`Cannot wait for a negative or 0 amount of seconds`);
        }

        if (isNaN(secondsToWait)) {
          return exits.error(`Invalid wait() syntax! example: wait(5)`);
        }

        await wait(secondsToWait);
        commandsExecuted.push({
          result: `Waited for ${secondsToWait} seconds`
        });
      } else {
        let commandToExec = command;
        if (!_.isUndefined(inputs.player)) {
          commandToExec = await sails.helpers.sdtd.fillPlayerVariables(command, inputs.player);
        }
        let commandResult = await executeCommand(inputs.server, commandToExec);
        commandsExecuted.push(commandResult);
      }
    }

    return exits.success(commandsExecuted);

  }


};

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
