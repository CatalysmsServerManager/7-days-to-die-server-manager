const split = require('split-string');

class CustomFunction {

  constructor(name) {
    if (!name) { throw new Error('Must provide a name'); }
    this.name = name;
  }

  _parseArgs(args) {
    if (!args) { return []; }
    const splitArgs = split(args, { separator: ',', quotes: ['"', '\''] });
    return splitArgs.map(x => {
      const num = parseInt(x, 10);
      if (Number.isNaN(num)) {
        return x.trim().split('"').join('');
      } else {
        return num;
      }
    });
  }

  exec() {
    throw new Error('Must be implemented');
  }

  async run(server, args) {
    sails.log.debug(`Executing custom function ${this.name} with args ${args}`);
    return this.exec(server, this._parseArgs(args));
  }

}


module.exports = CustomFunction;
