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
      sails.log.debug('VIEW - SdtdServer:players - serving players view')
      let server = await SdtdServer.findOne({
        id: inputs.serverId
      });
      let players = await Player.find({
        server: server.id
      });
      exits.success({
        players: players,
        server: server
      })
    } catch (error) {
      sails.log.error(`VIEW - SdtdServer:players - ${error}`)
    }

  }


};
