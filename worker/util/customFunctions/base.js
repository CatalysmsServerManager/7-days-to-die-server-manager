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
      x = x.trim().split('"').join('');
      // To to parse as number
      const num = parseInt(x, 10);
      if (Number.isNaN(num)) {
        // If it's not a number, just return the raw string
        return x;
      } else {
        // If it is a number, check if it's a safe integer
        // If it's higher, precision will get lost (numbers will change)
        // IDs will generally not be safe integers and should be strings
        if (Number.isSafeInteger(num)) {
          return num;
        } else {
          return x;
        }
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
