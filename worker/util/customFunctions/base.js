class CustomFunction {

  _parseArgs(args) {
    if (Array.isArray(args)) {
      return args.map(x => parseInt(x, 10));
    }
    return parseInt(args, 10);
  }

  exec() {
    throw new Error('Must be implemented');
  }

  run(args) {
    return this.exec(this._parseArgs(args));
  }

}


module.exports = CustomFunction;
