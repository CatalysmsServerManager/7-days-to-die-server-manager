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
   * @returns {[ {customFunction: CustomFunction, functionString: String}]}
   */
  findFunctions(stringToTest) {
    const foundFunctions = [];
    for (const customFunction of this.functions) {
      for (const command of stringToTest) {

        let functionString = this._getFunctionStringFromCommand(command, customFunction);
        foundFunctions.push({customFunction: customFunction, functionString: functionString});
      }
    }
    return _.uniqBy(foundFunctions, 'functionString');
  }

  _getFunctionStringFromCommand(commandString, functionToExec) {
    const startFunctionIndex = commandString.indexOf(functionToExec.key + "(");
    const endFunctionIndex = commandString.indexOf(")", startFunctionIndex);
    return commandString.slice(startFunctionIndex, endFunctionIndex + 1);
  }

  async parseCommand(command, {
    player,
    server
  }) {
    let commandString = String(command);
    let functionsToExec = this.findFunctions(command);

    for (const {customFunction, functionString} of functionsToExec) {
      let result;

      if (!functionString.startsWith(customFunction.key + "(") && functionString.endsWith(')')) {
        sails.log.warn(`Unexpected invalid function syntax - ${functionString}`, {
          command: command
        });
        return commandString;
      };

      const argumentsArray = functionString.replace(customFunction.key + "(", '').replace(')', '').split(',');
      result = await customFunction.execute(player, server, argumentsArray);
      if (result.status) {
        if (_.isUndefined(result.result)) {
          commandString = commandString.split(functionString).join("");
        } else {
          commandString = commandString.split(functionString).join(result.result);
        }
      } else {
        commandString = `say "${result.friendlyMessage}"`;
      }
    }

    return commandString;
  }

}


module.exports = new CustomFunctions();
