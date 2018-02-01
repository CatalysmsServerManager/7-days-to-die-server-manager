module.exports = {


  friendlyName: 'Edit ticket details',


  description: 'Update the details of a ticket',


  inputs: {
    ticketId: {
      required: true,
      type: 'string'
    },
    description: {
      type: 'string'
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
     * @name edit-ticket
     * @method
     * @description Changes details of a ticket
     * @param {string} ticketId
     */


  fn: async function (inputs, exits) {

    try {
      sails.log.debug(`API - SdtdTicket:edit-ticket - Editing info for ticket ${inputs.ticketId}`);

      await SdtdTicket.update({id: inputs.ticketId}, {
        description: inputs.description
      });

      return exits.success();
    } catch (error) {
      sails.log.error(`API - SdtdTicket:edit-ticket - ${error}`);
      return exits.error(error);
    }


  }


};
