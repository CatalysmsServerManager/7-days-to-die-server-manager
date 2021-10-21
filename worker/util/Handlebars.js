const Handlebars = require('handlebars');
// The library will automatically register the helpers with Handlebars
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
]);

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


module.exports = Handlebars;
