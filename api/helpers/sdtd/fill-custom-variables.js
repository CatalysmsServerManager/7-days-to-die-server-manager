module.exports = {
  friendlyName: 'Fill custom variables',
  description: '',
  inputs: {
    command: {
      type: 'string',
      required: true
    },
    data: {
      type: 'ref',
      required: true
    }
  },
  exits: {
    success: {
      outputFriendlyName: 'Success',
      outputType: 'boolean'
    },
  },
  fn: async function (inputs, exits) {
    return exits.success(inputs.command.toString().replace(/\$\{([^}]+)\}/g, function (match, group1) {
      const randNumberMatch = group1.trim().match(/^randNum:(\d+)-(\d+)$/);
      if (randNumberMatch) {
        let [, min, max] = randNumberMatch.map(i=>Number.parseInt(i, 10));
        if (max >= min) {
          return Math.floor(Math.random() * (max - min + 1) ) + min;
        }
      }
      return _.get(inputs.data, group1, match);
    }));
  }

};
