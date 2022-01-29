const persistentVariables = require('../../CSMMCommand/persistentVariables');
const CustomFunction = require('../base');

class SetVar extends CustomFunction {
  constructor() { super('SetVar'); }
  async exec(server, args) {
    const varName = args[0];
    const varValue = args[1];

    return persistentVariables.set(server, varName, varValue);
  }
}

module.exports = SetVar;
