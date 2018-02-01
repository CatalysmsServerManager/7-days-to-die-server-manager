var sevenDays = require('machinepack-7daystodiewebapi');

module.exports = {


  friendlyName: 'Create support ticket',


  description: 'Creates a support ticket, with relevant data',


  inputs: {

    serverId: {
      type: 'number',
      description: 'Id of the server',
      required: true
    },

    playerId: {
      type: 'number',
      description: 'Id of the player creating the ticket',
      required: true
    },

    title: {
      type: 'string',
      description: 'Title of the ticket',
      required: true
    },

    description: {
      type: 'string',
      description: 'Description of the ticket'
    }

  },


  exits: {
    success: {
      outputFriendlyName: 'Success',
      outputType: 'json'
    },

    notAvailable: {
      outputFriendlyName: 'Not available',
      description: 'The server could not be reached'
    }
  },

  /**
   * @description Creates a SdtdTicket
   * @name createTicket
   * @memberof module:Helpers
   * @returns {json} SdtdTicket
   * @method
   * @param {number} serverId
   * @param {number} playerId
   * @param {string} title
   * @param {string} description
   */

  fn: async function (inputs, exits) {
    sails.log.debug(`HELPER - createTicket - Creating a ticket for server ${inputs.serverId} by player ${inputs.playerId}`);

    try {
      let sdtdServer = await SdtdServer.findOne({
        id: inputs.serverId
      });
      let player = await Player.findOne({
        id: inputs.playerId
      });

      if (_.isUndefined(sdtdServer) || _.isUndefined(player)) {
        return exits.error(new Error(`HELPER - createTicket - Invalid server or player ID`));
      }

      let ticket = await SdtdTicket.create({
        description: inputs.description,
        title: inputs.title,
        playerInfo: player,
        server: inputs.serverId,
        player: inputs.playerId
      });

      return exits.success(ticket);

    } catch (error) {
      sails.log.error(`HELPER - createTicket - ${error}`);
      return exits.error(error);
    }





  }


};
