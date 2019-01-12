/**
 * @class CustomFunction
 * @type {Object}
 * @property {string} name
 */
class CustomFunction {

  constructor(options) {
    this.key = options.key;
  }
  /**
   * @param argument
   * @returns Boolean
   */

  validateArgument(arg) {
    throw new Error(`You must override "validateArgument"`);
  }



  parseArguments(args) {
    throw new Error(`You must override "parseArguments"`);
  }

  /**
   * Returns a message string if success, throws an error with friendly info
   * @param {} chatMessage 
   * @param {*} player 
   * @param {*} server 
   * @param {number} seconds 
   */
  run(chatMessage, player, server, args) {
    throw new Error(`You must override "run"`);
  }

  /**
   * 
   * @param {*} chatMessage A chatMessage object. Must have a .reply() object
   * @param {*} player 
   * @param {*} server 
   * @param {*} args 
   */

  async execute(chatMessage, player, server, args) {

    const resultObject = {
      // Shows if execution was successful
      status: false,
      // POJO
      result: {},
      // A friendly message which can be shown to the user
      friendlyMessage: new String(),
    };
    let parsedArguments = await this.parseArguments(args);
    let validArg = await this.validateArgument(parsedArguments);
    if (!validArg) {
      resultObject.friendlyMessage = `You have provided an invalid argument! Please contact your server administrator if you think this is a mistake.`;
      resultObject.result = parsedArguments;
      sails.log.debug(`CustomFunction - Invalid arguments given to ${this.key}.`, args);
      return resultObject;
    }

    try {
      resultObject.result = await this.run(parsedArguments, server, player);
      resultObject.status = true;
    } catch (error) {
      sails.log.error(error);
      resultObject.result = error;
      resultObject.friendlyMessage = `An internal error occurred. Please contact support. ${sails.config.custom.supportLink}`;
    }

    sails.log.debug(`Executed custom function ${this.key} - status: ${resultObject.status}. | msg: ${resultObject.friendlyMessage}`, {
      result: resultObject.result
    });
    return resultObject;
  }


}

module.exports = CustomFunction;
