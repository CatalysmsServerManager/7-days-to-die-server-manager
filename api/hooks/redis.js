const Sentry = require("@sentry/node");
const redis = require("redis");

/*
 * A hook that manages the redis connection
 * To be reused by anything that needs to talk to redis
 * @param {*} sails
 */

module.exports = function BullBoard(sails) {
  return {
    /**
     * Initialize the hook
     * @param  {Function} cb Callback for when we're done initializing
     * @return {Function} cb Callback for when we're done initializing
     */
    initialize: function (cb) {
      this.client = redis.createClient({ url: process.env.REDISSTRING });

      this.client.on("error", function (error) {
        sails.log.error(`Redis error: ${error.message}`, { args: error.args });
        Sentry.captureException(error);
      });

      return cb();
    },
  };
};
