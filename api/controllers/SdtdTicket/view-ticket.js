module.exports = {


  friendlyName: 'View a ticket',


  description: 'Loads relevant ticket data, and serves the view',


  inputs: {
    ticketId: {
      type: 'string',
      required: true
    }
  },


  exits: {

    notFound: {
      description: 'Ticket with given ID not found in the system',
      responseType: 'notFound'
    },
    success: {
      description: '',
      responseType: 'view',
      viewTemplatePath: 'sdtdTicket/ticket'
    }

  },

  /**
     * @memberof SdtdTicket
     * @name view-ticket
     * @method
     * @description Loads relevant ticket data, and serves the view
     * @param {string}ticketId
     */


  fn: async function (inputs, exits) {

    try {
      sails.log.debug(`API - SdtdTicket:viewTicket - Loading ticket view for ticket ${inputs.ticketId}`);

      let ticket = await SdtdTicket.findOne(inputs.ticketId);
      let server = await SdtdServer.findOne(ticket.server);

      return exits.success({
        server: server,
        ticket: ticket
      });

    } catch (error) {
      sails.log.error(`API - SdtdTicket:viewTicket - ${error}`);
      return exits.error(error);
    }


  }


};
