const persistentVariables = require('../../CSMMCommand/persistentVariables');
const CustomFunction = require('../base');

class GetVar extends CustomFunction {
  constructor() { super('GetVar'); }
  async exec(server, args) {
    const varName = args[0];

    return persistentVariables.get(server, varName);
  }
}

module.exports = GetVar;
