/**
 * cron hook
 *
 * @description :: A hook definition.  Extends Sails by adding shadow routes, implicit actions, and/or initialization logic.
 * @docs        :: https://sailsjs.com/docs/concepts/extending-sails/hooks
 */

module.exports = function defineCronHook(sails) {
  
  return {

    /**
     * Runs when a Sails app loads/lifts.
     *
     * @param {Function} done
     */
    initialize: function (done) {

      sails.log.info('Initializing custom hook (`cron`)');

      // Be sure and call `done()` when finished!
      // (Pass in Error as the first argument if something goes wrong to cause Sails
      //  to stop loading other hooks and give up.)
      return done();

    },

    start: function(jobId) {

    },

    stop: function(jobId) {

    },

  };



};
