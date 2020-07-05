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

    try {
      let sdtdServer = await SdtdServer.findOne({
        id: inputs.serverId
      });
      let player = await Player.findOne(inputs.playerId);
      let playerInfo = await sails.helpers.sdtd.loadPlayerData(inputs.serverId, player.steamId);

      if (_.isUndefined(sdtdServer) || _.isUndefined(player)) {
        return exits.error(new Error(`HELPER - createTicket - Invalid server or player ID`));
      }

      let ticket = await SdtdTicket.create({
        description: inputs.description,
        title: inputs.title,
        playerInfo: playerInfo[0],
        server: inputs.serverId,
        player: inputs.playerId
      }).fetch();

      await sails.hooks.discordnotifications.sendNotification({
        serverId: ticket.server,
        notificationType: 'ticket',
        ticketNotificationType: 'New ticket',
        ticket: ticket
      });

      sails.log.info(`HELPER - createTicket - Created a ticket for server ${sdtdServer.name} by player ${player.name} titled "${ticket.title}"`);
      return exits.success(ticket);

    } catch (error) {
      sails.log.error(`HELPER - createTicket - ${error}`);
      return exits.error(error);
    }





  }


};
