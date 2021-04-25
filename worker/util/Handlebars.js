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

Handlebars.registerHelper('sum', function (a, b) {
  return a + b;
});

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

module.exports = Handlebars;
