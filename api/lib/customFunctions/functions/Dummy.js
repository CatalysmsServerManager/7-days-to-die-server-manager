const CustomFunction = require('../CustomFunction');

class Dummy extends CustomFunction {

  constructor() {
    super({
      key: "dummy"
    });
  }

  validateArgument(seconds) {
    return true;
  }

  parseArguments(args) {
    return true;
  }

  async run(seconds, server, player) {
    return true;
  }

}

module.exports = new Dummy();
