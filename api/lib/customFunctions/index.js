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
   * @returns {CustomFunction}
   */
  findFunction(stringToTest) {
    for (const customFunction of this.functions) {
      if (stringToTest.includes(customFunction.key + "(")) {
        return customFunction;
      }
    }
  }

  async parseCommand(command, {chatMessage, player, server}) {
    let functionToExec = this.findFunction(command);

    if (functionToExec) {
      let argumentsArray = command.replace(functionToExec.key + "(", '').replace(')', '').split(',');
      return functionToExec.execute(chatMessage, player, server, argumentsArray);
    }

    return;


  }

}


module.exports = new CustomFunctions();
