const wait = require('../wait');
const CustomFunction = require('./base');

class Wait extends CustomFunction {

  exec(args) {
    return wait.wait(args);
  }
}

module.exports = Wait;
