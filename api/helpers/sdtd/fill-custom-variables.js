function randNum(matches) {
  let [, min, max] = matches.map(i=>Number.parseInt(i, 10));
  if (max >= min) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
  }
  return null;
}

function randList(matches) {
  let choices = matches[1].split(',').map(s=>s.trim());
  return choices[Math.floor(Math.random() * choices.length)];
}

const customVariables = [
  [/^randNum:(-?\d+):(-?\d+)$/, randNum],
  [/^randList:(.*)$/, randList]
];

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
      for (const func of customVariables) {
        const matches = group1.trim().match(func[0]);
        if (!matches) { continue; }
        const value = func[1](matches);
        if (value !== null) {
          return value;
        }
      }
      return _.get(inputs.data, group1, match);
    }));
  }

};
