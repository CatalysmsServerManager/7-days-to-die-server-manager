module.exports = {


  friendlyName: 'Get players view',


  description: 'Load the player overview view',


  inputs: {
    serverId: {
      required: true,
      example: 4
    }
  },


  exits: {
    success: {
      responseType: 'view',
      viewTemplatePath: 'sdtdServer/players'
    }

  },

  /**
   * @memberof SdtdServer
   * @name get-players-view
   * @method
   * @description Serve the players views
   * @param {number} serverId ID of the server
   */


  fn: async function (inputs, exits) {

    try {
      let server = await SdtdServer.findOne({
        id: inputs.serverId
      });
      let players = await Player.find({server: server.id})

      players.map(player => {
        const hhmmss = require('@streammedev/hhmmss')
        let newPlaytime = hhmmss(player.playtime);
        player.playtimeHHMMSS = newPlaytime;
        return player;
      });

      sails.log.info(`VIEW - SdtdServer:players - Showing players for ${server.name} - ${players.length} players`);

      exits.success({
        players: players,
        server: server
      });
    } catch (error) {
      sails.log.error(`VIEW - SdtdServer:players - ${error}`);
    }

  }


};
