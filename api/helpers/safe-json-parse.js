const Sentry = require('@sentry/node');
module.exports = {
  friendlyName: 'safeJSONParse',
  description: 'parse json in a way that cant actually crash',
  inputs: {
    json: {
      required: false,
      type: 'string'
    },
    defaultValue: {
      required: false,
      type: 'ref'
    },
    context: {
      required: false,
      type: 'ref'
    },
  },
  exits: {
  },
  sync: true,
  fn: function ({json, defaultValue, context}, exits) {
    try {
      const val = JSON.parse(json);
      return exits.success(val);
    } catch (e) {
      Sentry.withScope(function(scope) {
        scope.setExtra('json', json);
        if (context) {
          for (const key of Object.keys(context)) {
            scope.setExtra(key, context[key]);
          }
        }
        Sentry.captureMessage(e);
      });
      return exits.success(defaultValue);
    }
  }
}
