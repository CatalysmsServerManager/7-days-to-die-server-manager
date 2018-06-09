/**
 * gbl hook
 *
 * @description :: A hook definition.  Extends Sails by adding shadow routes, implicit actions, and/or initialization logic.
 * @docs        :: https://sailsjs.com/docs/concepts/extending-sails/hooks
 */

module.exports = function defineGblHook(sails) {

  return {

    /**
     * Runs when a Sails app loads/lifts.
     *
     * @param {Function} done
     */
    initialize: async function (done) {
      sails.on('hook:discordbot:loaded', async () => {

        sails.log.info('Initializing custom hook (`gbl`)');

        let sixHours = 21600000;

        refreshBans();

        setInterval(async () => {
          refreshBans();
        }, sixHours)

        return done();

      })

    }

  };

};


async function refreshBans() {
  let sdtdServers = await SdtdServer.find({});

  for (const server of sdtdServers) {
    try {
      await sails.helpers.sdtd.loadBans(server.id);
    } catch (error) {
      sails.log.warn(`Error refreshing ban info for server ${server.name}`, error)
    }
  }
  sails.log.info(`Reloaded bans for ${sdtdServers.length} servers!`)
}