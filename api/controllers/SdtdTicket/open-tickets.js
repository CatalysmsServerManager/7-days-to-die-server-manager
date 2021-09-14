module.exports = {


  friendlyName: 'Get open tickets for a server',


  description: 'Get open tickets for a server',


  inputs: {
    serverId: {
      type: 'string'
    }
  },


  exits: {
    success: {}

  },

  /**
   * @memberof SdtdTicket
   * @name open-tickets
   * @method
   * @description Get open tickets for a server
   * @param {string} serverId
   */


  fn: async function (inputs, exits) {

    try {
      let openTickets = await SdtdTicket.find({
        server: inputs.serverId,
        status: true
      });
      sails.log.debug(`API - SdtdTicket:open-ticket - found ${openTickets.length} open tickets for server ${inputs.serverId}`, {serverId: inputs.serverId});
      return exits.success(openTickets);
    } catch (error) {
      sails.log.error(`API - SdtdTicket:open-tickets - ${error}`, {serverId: inputs.serverId});
      return exits.error(error);
    }


  }


};
