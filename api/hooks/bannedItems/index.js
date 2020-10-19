module.exports = function banneditems(sails) {
  return {
    initialize: function (cb) {
      return cb();
    },

    run: async function runBannedItems(data) {
      return sails.helpers.getQueueObject('bannedItems').add(data);
    },
  };
};
