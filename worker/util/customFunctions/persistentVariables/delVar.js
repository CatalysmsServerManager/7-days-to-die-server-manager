const persistentVariables = require('../../CSMMCommand/persistentVariables');
const CustomFunction = require('../base');

class DelVar extends CustomFunction {
  constructor() { super('DelVar'); }
  async exec(server, args) {
    const varName = args[0];

    return persistentVariables.del(server, varName);
  }
}

module.exports = DelVar;
