const { createBullBoard } = require('bull-board');
const path = require('path');
const { BullAdapter } = require('bull-board/bullAdapter');

module.exports = function BullBoard(sails) {
  return {
    /**
     * Default configuration
     *
     * We do this in a function since the configuration key for
     * the hook is itself configurable, so we can't just return
     * an object.
     */
    defaults: {
      __configKey__: {
      }
    },

    /**
     * Initialize the hook
     * @param  {Function} cb Callback for when we're done initializing
     * @return {Function} cb Callback for when we're done initializing
     */
    initialize: function (cb) {

      const { router } = createBullBoard([
        new BullAdapter(sails.helpers.getQueueObject('logs')),
        new BullAdapter(sails.helpers.getQueueObject('cron')),
        new BullAdapter(sails.helpers.getQueueObject('discordNotifications')),
        new BullAdapter(sails.helpers.getQueueObject('bannedItems')),
        new BullAdapter(sails.helpers.getQueueObject('playerTracking')),
        new BullAdapter(sails.helpers.getQueueObject('kill')),
        new BullAdapter(sails.helpers.getQueueObject('hooks')),
        new BullAdapter(sails.helpers.getQueueObject('system')),
        new BullAdapter(sails.helpers.getQueueObject('sdtdCommands')),
      ]);




      sails.after('hook:http:loaded', function () {
        sails.hooks.http.app.use(
          '/admin/queues',
          function (req, res, next) {
            /* Meh auth for static files */
            if (path.resolve(req.originalUrl).startsWith('/admin/queues/static/')) {
              return next();
            }
            return sails.hooks.policies.middleware.iscsmmadmin(req, res, next);
          },
          router
        );

      });
      // We're done initializing.
      // we don't actually need to wait for the above. It'll happen when it happens
      return cb();
    }
  };
};
