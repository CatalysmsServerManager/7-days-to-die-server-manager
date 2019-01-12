const CustomFunction = require('./CustomFunction');

/**
 * Controller class for all functions to be used in custom commands/cron jobs etc
 * @class CustomFunctions
 */


class CustomFunctions {

  constructor() {
    this.functions = [];

    var normalizedPath = require("path").join(__dirname, "functions");

    require("fs").readdirSync(normalizedPath).forEach((file) => {
      this.functions.push(require("./functions/" + file));
    });

    console.log(`Loaded ${this.functions.length} custom functions`);
  }

  /**
   * 
   * @param {string} stringToTest 
   * @returns {[CustomFunction]}
   */
  findFunctions(stringToTest) {
    const foundFunctions = [];
    for (const customFunction of this.functions) {
      if (stringToTest.includes(customFunction.key + "(")) {
        foundFunctions.push(customFunction);
      }
    }
    return foundFunctions;
  }

  async parseCommand(command, {
    chatMessage,
    player,
    server
  }) {
    let commandString = String(command);
    let functionsToExec = this.findFunctions(command);

    for (const functionToExec of functionsToExec) {
      const startFunctionIndex = commandString.indexOf(functionToExec.key + "(");
      const endFunctionIndex = commandString.indexOf(")", startFunctionIndex);
      const functionString = commandString.slice(startFunctionIndex, endFunctionIndex + 1);
      let result;
      if (functionString.startsWith(functionToExec.key + "(") && functionString.endsWith(')')) {
        const argumentsArray = functionString.replace(functionToExec.key + "(", '').replace(')', '').split(',');
        result = await functionToExec.execute(chatMessage, player, server, argumentsArray);
        if (result.status) {
          if (_.isUndefined(result.result)) {
            commandString = commandString.replace(functionString, "");
          } else {
            commandString = commandString.replace(functionString, result.result);
          }
        } else {
          commandString = `say "${result.friendlyMessage}"`;
        }
      } else {
        sails.log.warn(`Unexpected invalid function syntax - ${functionString}`, {
          command: command
        });
      }
    }

    return commandString;
  }

}


module.exports = new CustomFunctions();
