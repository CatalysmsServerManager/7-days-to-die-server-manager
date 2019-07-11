module.exports = {


  friendlyName: 'Get players',


  description: 'Loads data about all players associated with a server',


  inputs: {
    serverId: {
      required: true,
      example: 4
    },
    onlyOnline: {
      example: true,
      description: 'Only loads online player data, defaults to true'
    },
    staticOnly: {
      type: 'boolean',
      description: "Only get information in the database, don't try and update it. Defaults to false. This should be used when performance/speed is more important than newest information."
    }

  },

  exits: {
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

      if (inputs.staticOnly) {

        let players = await Player.find({
          server: server.id
        }).populate('role');
        return exits.success(players.map(p => _.omit(p, 'inventory')));

      } else {
        sails.helpers.sdtd.loadPlayerData.with({
            serverId: inputs.serverId,
            onlyOnline: inputs.onlyOnline === false ? false : true
          })
          .switch({
            success: function (data) {
              return exits.success(data);
            },
            error: function (error) {
              return exits.badRequest();
            }
          });
      }

    } catch (error) {
      sails.log.error(`API - SdtdServer:getPlayers - ${error}`);
      return exits.error(error);
    }

  }


};
