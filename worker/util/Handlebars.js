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

module.exports = Handlebars;
