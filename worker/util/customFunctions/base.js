const split = require('split-string');

class CustomFunction {

  constructor(server) {
    if (!server) { throw new Error('Must provide a server'); }
    this.server = server;

  }

  _parseArgs(args) {
    if (!args) { return []; }
    const splitArgs = split(args, { separator: ',', quotes: ['"', '\''] });
    return splitArgs.map(x => {
      const num = parseInt(x, 10);
      if (Number.isNaN(num)) {
        return x;
      } else {
        return num;
      }
    });
  }

  exec() {
    throw new Error('Must be implemented');
  }

  async run(args) {
    return this.exec(this._parseArgs(args));
  }

}


module.exports = CustomFunction;
