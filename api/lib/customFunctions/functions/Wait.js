const CustomFunction = require('../CustomFunction');

class Wait extends CustomFunction {

  constructor() {
    super({
      key: "wait"
    });
  }

  validateArgument(seconds) {
    if (!_.isNumber(seconds)) {
      return false;
    }

    if (seconds < 1) {
      return false;
    }

    return true;
  }

  parseArguments(args) {
    if (!this.validateArgument(args[0])) {
      return false;
    }
    return parseInt(args[0]);
  }

  async run(seconds, server, player) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, seconds * 1000)
    });
  }

}

module.exports = new Wait();
