const CustomFunction = require('../CustomFunction');

class Wait extends CustomFunction {

  constructor() {
    super({
      key: "wait"
    });
  }

  validateArgument(seconds) {
    if (!_.isFinite(seconds)) {
      return false;
    }

    if (seconds < 1) {
      return false;
    }

    return true;
  }

  parseArguments(args) {
    args = parseInt(args[0]);
    if (!this.validateArgument(args)) {
      return false;
    }
    return args;
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
