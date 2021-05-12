const wait = require('../wait');
const CustomFunction = require('./base');

class Wait extends CustomFunction {
  constructor(server) { super(server); }

  exec(args) {
    return wait.wait(parseInt(args[0], 10));
  }
}

module.exports = Wait;
