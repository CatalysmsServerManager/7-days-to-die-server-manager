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
    },
    notFound: {
      responseType: 'notFound',
      description: 'Server was not found in DB'
    }
  },

  /**
   * @memberof SdtdServer
   * @method
   * @name get-players
   * @description Get information about all players that have logged into the server
   * @param {number} serverId ID of the server
   */

  fn: async function (inputs, exits) {
    try {
      let server = await SdtdServer.findOne({
        id: inputs.serverId
      });
      if (_.isUndefined(server)) {
        return exits.notFound();
      }
      sails.helpers.loadPlayerData(server.id)
        .switch({
          success: function(data) {
            sails.log.debug(`API - SdtdServer:getPlayers - Loaded player data for server ${inputs.serverId}! - Found ${data.totalPlayers} players`);
            return exits.success(data);
          },
          error: function(error) {
            return exits.badRequest();
          }
        });
    } catch (error) {
      sails.log.error(`API - SdtdServer:getPlayers - ${error}`);
      return exits.error(error);
    }

  }


};
