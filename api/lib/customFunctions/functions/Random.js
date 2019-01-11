const CustomFunction = require('../CustomFunction');

class Random extends CustomFunction {

  constructor() {
    super({
      key: "random"
    });
  }

  validateArgument(args) {

    let namecheck = (name) => {
      if (_.isEmpty(name)) {
        return false;
      }

      if (_.isString(name)) {
        return true;
      }
      return false;
    };

    let minCheck = (min) => {
      if (_.isUndefined(min)) {
        return true;
      }
      if (_.isInteger(min)) {
        return true;
      };
      return false;
    };

    let maxCheck = (max) => {
      if (_.isUndefined(max)) {
        return true;
      }
      if (_.isInteger(max)) {
        return true;
      };
      return false;
    };


    if (args.min > args.max) {
      return false;
    }

    let validName = namecheck(args.name);
    let validMin = minCheck(args.min)
    let validMax = maxCheck(args.max)

    if (validName && validMin && validMax) {
      return true;
    };

    return false;


  }

  parseArguments(args) {

    const resultArgs = {
      name: args[0],
      min: undefined,
      max: undefined
    };

    if (!_.isArray(args)) {
      return false;
    }

    if (!_.isUndefined(args[1])) {
      resultArgs.min = parseInt(args[1]);
    }

    if (!_.isUndefined(args[2])) {
      resultArgs.max = parseInt(args[2]);
    }

    if (!this.validateArgument(resultArgs)) {
      return false;
    }

    return resultArgs;
  }

  async run(args, server, player) {
    let minimum = -999999999999;
    let maximum = 999999999999;
    if (!_.isUndefined(args.min)) {
      minimum = args.min;
    }
    if (!_.isUndefined(args.max)) {
      maximum = args.max;
    }
    let response = await sails.helpers.etc.randomNumber(minimum, maximum);
    return response;
  }

}

module.exports = new Random();
