/**
 * custom Hooks
 *
 * @description :: A hook definition.  Extends Sails by adding shadow routes, implicit actions, and/or initialization logic.
 * @docs        :: https://sailsjs.com/docs/concepts/extending-sails/hooks
 */

const sevenDays = require('7daystodie-api-wrapper');

module.exports = function defineCustomHooksHook(sails) {

  return {

    /**
     * Runs when a Sails app loads/lifts.
     *
     * @param {Function} done
     */
    initialize: async function (done) {

      sails.on('lifted', async () => {

        sails.log.info('Initializing custom hooks');

        return;

      });

      return done();
    }

  };

};
