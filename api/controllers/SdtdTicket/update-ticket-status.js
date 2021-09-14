module.exports = {


  friendlyName: 'Update ticket status',


  description: 'Update the status of a SdtdTicket to closed/open',


  inputs: {
    ticketId: {
      required: true,
      type: 'string'
    },
    status: {
      required: true,
      type: 'boolean'
    }
  },


  exits: {

    notFound: {
      description: 'Ticket with given ID not found in the system',
      responseType: 'notFound'
    },
    success: {
    }

  },

  /**
     * @memberof SdtdTicket
     * @name update-ticket-status
     * @method
     * @description Changes the status of a ticket
     * @param {string} ticketId
     */


  fn: async function (inputs, exits) {

    try {

      let ticket = await SdtdTicket.update({id: inputs.ticketId}, {
        status: inputs.status
      }).fetch();

      ticket = ticket[0];

      await sails.helpers.discord.sendNotification({
        serverId: ticket.server,
        notificationType: 'ticket',
        ticketNotificationType: `${inputs.status ? 'Open' : 'Closed'}`,
        ticket: ticket
      });

      return exits.success();
    } catch (error) {
      sails.log.error(`API - SdtdTicket:update-ticket-status - ${error}`, {serverId: inputs.serverId});
      return exits.error(error);
    }


  }


};
