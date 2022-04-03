const promisedHandlebars = require('promised-handlebars');
const PersistentVariablesManager = require('./CSMMCommand/persistentVariables');


const Handlebars = promisedHandlebars(require('handlebars'), { Promise });
require('@budibase/handlebars-helpers')([
  'array',
  'collection',
  'comparison',
  'date',
  'inflection',
  'match',
  'math',
  'number',
  'regex',
  'string',
  'object'
], { handlebars: Handlebars });




Handlebars.registerHelper('eq', function (a, b) {
  return (a === b);
});
Handlebars.registerHelper('gt', function (a, b) {
  return (a > b);
});
Handlebars.registerHelper('gte', function (a, b) {
  return (a >= b);
});
Handlebars.registerHelper('lt', function (a, b) {
  return (a < b);
});
Handlebars.registerHelper('lte', function (a, b) {
  return (a <= b);
});
Handlebars.registerHelper('ne', function (a, b) {
  return (a !== b);
});

Handlebars.registerHelper('or', function (a, b) {
  return (a || b);
});

Handlebars.registerHelper('and', function (a, b) {
  return (a && b);
});

Handlebars.registerHelper('not', function (a) {
  return !a;
});

const add = (a, b) => {
  // We parse the arguments to numbers here
  // because in 99% of the cases, the user wants to do numeric addition
  // "1" + 1 should not equal 11
  const result = parseInt(a, 10) + parseInt(b, 10);

  if (isNaN(result)) {
    // If the result is not a number, we'll assume the users wants to do string concatenation instead
    return a + b;
  }

  return result;
};

Handlebars.registerHelper('sum', add);
Handlebars.registerHelper('add', add);

Handlebars.registerHelper('subtract', function (a, b) {
  return a - b;
});

Handlebars.registerHelper('multiply', function (a, b) {
  return a * b;
});

Handlebars.registerHelper('divide', function (a, b) {
  return a / b;
});

Handlebars.registerHelper('mod', function (a, b) {
  return a % b;
});

Handlebars.registerHelper('round', function (original, decimals = 1) {
  if (decimals < 0) {
    decimals = 1;
  }
  return original.toFixed(decimals);
});

Handlebars.registerHelper('sort', function (array, propertyPath, order) {
  order = order.toLowerCase();

  const props = propertyPath.split('.');

  switch (order) {
    case 'asc':
      return array.sort((a, b) => _.get(a, props) - _.get(b, props));
    case 'desc':
      return array.sort((a, b) => _.get(b, props) - _.get(a, props));
    default:
      throw new Error('Order must be either asc or desc');
  }
});


Handlebars.registerHelper('randNum', function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
});

Handlebars.registerHelper('randList', function (...options) {
  // We get rid of the last element because the last element is something internal from Handlebars
  const choices = options
    .slice(0, options.length - 1)
    .map(s => s.trim());

  return choices[Math.floor(Math.random() * choices.length)];
});


Handlebars.registerHelper('setVar', async function setVar(name, value, options) {
  if (!options.data.root.server) {
    throw new Error('Persistent variables can only be used in context of a server, this is likely an implementation error');
  }
  if (!name) {
    throw new Error('setVar: You must provide the variable name');
  }
  if (!value) {
    throw new Error('setVar: You must provide the variable value');
  }

  await PersistentVariablesManager.set(options.data.root.server, name, value);
});

Handlebars.registerHelper('getVar', async function getVar(name, options) {
  if (!options.data.root.server) {
    throw new Error('Persistent variables can only be used in context of a server, this is likely an implementation error');
  }
  if (!name) {
    throw new Error('getVar: You must provide the variable name');
  }

  return PersistentVariablesManager.get(options.data.root.server, name);
});

Handlebars.registerHelper('delVar', async function delVar(name, options) {
  if (!options.data.root.server) {
    throw new Error('Persistent variables can only be used in context of a server, this is likely an implementation error');
  }
  if (!name) {
    throw new Error('delVar: You must provide the variable name');
  }

  await PersistentVariablesManager.del(options.data.root.server, name);
});

Handlebars.registerHelper('execCmd', async function execCmd(command, options) {
  if (!options.data.root.server) {
    throw new Error('execCmd can only be used in context of a server, this is likely an implementation error');
  }

  const server = options.data.root.server;
  const { result } = await sails.helpers.sdtdApi.executeConsoleCommand(SdtdServer.getAPIConfig(server), command);

  return result;
});


Handlebars.registerHelper('times', function (n, block) {
  if (n > 100) {
    throw new Error('times: n must be less than 100');
  }
  var accum = '';
  for (var i = 0; i < n; ++i) {
    block.data.root.index = i;
    block.data.root.isFirst = i === 0;
    block.data.root.isLast = i === (n - 1);
    accum += block.fn(this);
  }
  return accum;
});

Handlebars.registerHelper('datePassed', function (date) {
  return ((Date.now() - Date.parse(date)) >= 0);
});

module.exports = Handlebars;
