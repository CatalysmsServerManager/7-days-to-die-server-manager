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

      let ticket = await SdtdTicket.findOne(inputs.ticketId).populate('comments');
      let server = await SdtdServer.findOne(ticket.server);

      let promises = ticket.comments.map(comment => {
        return new Promise((resolve, reject) => {
          User.findOne(comment.userThatPlacedTheComment).exec((err, foundUser) => {
            if (err) {
              reject(err);
            }
            comment.userInfo = foundUser;
            resolve(comment);
          });
        });
      });

      Promise.all(promises).then((comments) => {
        sails.log.info(`API - SdtdTicket:viewTicket - - Success, loaded ticket "${ticket.title}" for server ${server.name}`, _.omit(ticket, 'playerInfo'));
        return exits.success({
          server: _.omit(server, 'authName', 'authToken'),
          ticket: ticket,
          comments: comments
        });
      }).catch(() => {
        return exits.success({
          server: _.omit(server, 'authName', 'authToken'),
          ticket: ticket,
          comments: []
        });
      });


    } catch (error) {
      sails.log.error(`API - SdtdTicket:viewTicket - ${error}`);
      return exits.error(error);
    }


  }


};
