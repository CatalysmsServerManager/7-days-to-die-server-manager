const persistentVariables = require('../../CSMMCommand/persistentVariables');
const CustomFunction = require('../base');

class SetVar extends CustomFunction {
  constructor() { super('SetVar'); }
  async exec(server, args) {
    const varName = args[0];
    const varValue = args[1];

    let varPreventDeletion = args[2];

    if (varPreventDeletion === undefined) {
      varPreventDeletion = false;
    }
    else if (varPreventDeletion === 'true' || varPreventDeletion === 'false') {
      varPreventDeletion = (varPreventDeletion === 'true');
    }

    return persistentVariables.set(server, varName, varValue, varPreventDeletion);
  }
}

module.exports = SetVar;
