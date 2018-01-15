module.exports = {


  friendlyName: 'Get players',


  description: 'Loads data about all players associated with a server',


  inputs: {
    serverId: {
      required: true,
      example: 4
    }

  },

  exits: {
    notFound: {
      description: 'Server with given ID was not found in the system'
    },
    badRequest: {
      responseType: 'badRequest'
    }
  },

  /**
   * @memberof SdtdServer
   * @name get-players
   * @description Get information about all players that have logged into the server
   * @param {number} serverId ID of the server
   */

  fn: async function (inputs, exits) {
    sails.log.debug(`API - SdtdServer:getPlayers - Loading player data!`);
    try {
      let server = await SdtdServer.findOne({
        id: inputs.serverId
      });
      sails.helpers.loadPlayerData(server.id)
        .switch({
          success: function(data) {
            return exits.success(data)
          },
          error: function() {
            return exits.badRequest()
          }
        })
    } catch (error) {
      sails.log.error(`API - SdtdServer:getPlayers - ${error}`)
      return exits.error(error)
    }

  }


};
