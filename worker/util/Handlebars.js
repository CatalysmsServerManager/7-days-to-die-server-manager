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


Handlebars.registerHelper('setVar', async function setVar(name, value, preventDeletion, options) {

  if (typeof preventDeletion !== 'boolean') {
    options = preventDeletion;
    preventDeletion = false;
  }

  if (!options.data.root.server) {
    throw new Error('Persistent variables can only be used in context of a server, this is likely an implementation error');
  }

  if (!name) {
    throw new Error('setVar: You must provide the variable name');
  }
  if (!value && value !== 0) {
    throw new Error('setVar: You must provide the variable value');
  }

  await PersistentVariablesManager.set(options.data.root.server, name, value, preventDeletion);
});

Handlebars.registerHelper('listVar', async function listVar(query, sortBy, sortDirection, limit, options) {

  if (arguments.length === 1 || arguments.length > 5) {
    throw new Error('listVar: Invalid number of arguments provided');
  }

  // Search
  if (arguments.length === 2) {

    query = arguments[0];

    if (typeof query !== 'string') {
      throw new Error('listVar: Invalid argument for query');
    }

    options = arguments[1];

    sortBy = '';
    sortDirection = '';
    limit = -1;
  }

  // Search with limit
  if (arguments.length === 3) {
    query = arguments[0];

    if (typeof query !== 'string') {
      throw new Error('listVar: Invalid argument for query');
    }

    limit = arguments[1];

    if (typeof limit !== 'number') {
      throw new Error('listVar: Invalid argument for limit');
    }

    options = arguments[2];

    sortBy = '';
    sortDirection = '';
  }

  const sortByOptions = {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    name: 'name',
    value: 'value',
    preventDeletion: 'preventDeletion'
  };

  const sortDirectionOptions = {
    ASC: 'ASC',
    DESC: 'DESC',
    asc: 'ASC',
    desc: 'DESC'
  };

  // Search with sorting
  if (arguments.length === 4) {
    query = arguments[0];

    if (typeof query !== 'string') {
      throw new Error('listVar: Invalid argument for query');
    }

    sortBy = arguments[1];
    sortDirection = arguments[2];

    if (typeof sortBy !== 'string' || typeof sortDirection !== 'string' || !sortBy || !sortDirection) {
      throw new Error('listVar: Invalid argument for sorting');
    }

    if (sortBy && !sortByOptions[sortBy] || sortDirection && !sortDirectionOptions[sortDirection]) {
      throw new Error('listVar: Invalid argument for sorting');
    }

    options = arguments[3];

    limit = -1;
  }

  // Search with sorting and limit
  if (arguments.length === 5) {
    query = arguments[0];

    if (typeof query !== 'string') {
      throw new Error('listVar: Invalid argument for query');
    }

    sortBy = arguments[1];
    sortDirection = arguments[2];

    if (typeof sortBy !== 'string' || typeof sortDirection !== 'string' || !sortBy || !sortDirection) {
      throw new Error('listVar: Invalid argument for sorting');
    }

    if (sortBy && !sortByOptions[sortBy] || sortDirection && !sortDirectionOptions[sortDirection]) {
      throw new Error('listVar: Invalid argument for sorting');
    }

    limit = arguments[3];

    if (typeof limit !== 'number') {
      throw new Error('listVar: Invalid argument for limit');
    }

    options = arguments[4];
  }

  if (!options.data.root.server) {
    throw new Error('Persistent variables can only be used in context of a server, this is likely an implementation error');
  }

  return PersistentVariablesManager.list(options.data.root.server, query, sortBy, sortDirection, limit);
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
  if (n > 250) {
    throw new Error('times: n must be less than 250');
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
