module.exports = {


  friendlyName: 'Server tickets view',


  description: 'Loads relevant ticket data, and serves the view',


  inputs: {
    serverId: {
      type: 'string',
      required: true
    }
  },


  exits: {

    notFound: {
      description: 'Server with given ID not found in the system',
      responseType: 'notFound'
    },
    success: {
      description: '',
      responseType: 'view',
      viewTemplatePath: 'sdtdServer/tickets'
    }

  },

  /**
   * @memberof SdtdServer
   * @name tickets-view
   * @method
   * @description Loads relevant ticket data, and serves the view
   * @param {string} serverId
   */


  fn: async function (inputs, exits) {

    try {

      let server = await SdtdServer.findOne({
        id: inputs.serverId
      });
      let tickets = await SdtdTicket.find({
        server: inputs.serverId
      }).populate('player');

      if (_.isUndefined(server) || _.isUndefined(tickets)) {
        return exits.notFound();
      }

      sails.log.info(`API - SdtdServer:tickets-view - Success, loaded ${tickets.length} tickets for server ${server.name}`);
      return exits.success({
        server: _.omit(server, 'authName', 'authToken'),
        tickets: tickets
      });

    } catch (error) {
      sails.log.error(`API - SdtdServer:tickets-view - ${error}`);
      return exits.error(error);
    }


  }


};
