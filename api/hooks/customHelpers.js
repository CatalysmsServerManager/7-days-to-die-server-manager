const SdtdApi = require('7daystodie-api-wrapper');

module.exports = function CustomHelpers(sails) {
  return {
    initialize: function (cb) {
      sails.after('hook:helpers:loaded', async () => {
        sails.helpers.sdtdApi = {};
        for (const func of Object.keys(SdtdApi)) {
          sails.helpers.sdtdApi[func] = errorBoundary(SdtdApi[func]);
        }
        return cb();
      });
    }
  };
};

// Allocs fixes uses query parameters to pass the authentication info
// This means that these sensitive details are included in the error message when it comes from `fetch()`
// And then they might end up in the logs or error monitoring or shown to a user or ...
// This is a wrapper to protect against leaking this info where it shouldn't
// It supports async and sync functions
function errorBoundary(fn) {
  return (...args) => {
    try {
      const res = fn(...args);

      if (!res.then) {
        return res;
      }

      return new Promise((resolve, reject) => {
        res
          .then(resolve)
          .catch(error => {
            reject(new Error('Error connecting to the gameserver'));
          });
      });

    } catch (error) {
      throw new Error('Error connecting to the gameserver');
    }
  };
}
