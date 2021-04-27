const Handlebars = require('handlebars');

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
  return parseInt(a, 10) + parseInt(b, 10);
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

Handlebars.registerHelper('randList', function (options) {
  const choices = options.split(',').map(s => s.trim());
  return choices[Math.floor(Math.random() * choices.length)];
});


module.exports = Handlebars;
