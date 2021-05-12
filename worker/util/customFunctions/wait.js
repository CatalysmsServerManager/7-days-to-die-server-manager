const wait = require('../wait');
const CustomFunction = require('./base');

class Wait extends CustomFunction {
  constructor() { super('wait'); }

  async exec(server, args) {
    const seconds = args[0];
    await wait.wait(parseInt(seconds, 10));
    return `Waited for ${seconds} seconds`;

  }
}

module.exports = Wait;
