const SdtdApi = require('7daystodie-api-wrapper');

module.exports = function CustomHelpers(sails) {
  return {
    initialize: function (cb) {
      sails.after('hook:helpers:loaded', async () => {
        sails.helpers.sdtdApi = {};
        for (const func of Object.keys(SdtdApi)) {
          sails.helpers.sdtdApi[func] = SdtdApi[func];
        }
        return cb();
      });
    }
  };
};
