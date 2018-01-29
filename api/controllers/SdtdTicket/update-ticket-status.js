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
        sails.log.debug(`API - SdtdTicket:update-ticket-status - Updating status for ticket ${inputs.ticketId}`);

        await SdtdTicket.update({id: inputs.ticketId}, {
          status: inputs.status
        })
      
        return exits.success()
      } catch (error) {
        sails.log.error(`API - SdtdTicket:update-ticket-status - ${error}`);
        return exits.error(error)
      }
  
  
    }
  
  
  };
  