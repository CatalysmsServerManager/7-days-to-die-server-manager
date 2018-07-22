/**
 * SdtdTicket.js
 *
 * @description Player-made tickets for admin support
 * @module SdtdTicket
 */

module.exports = {

  attributes: {

    /**
     * @var description
     * @description Description for this ticket
     * @memberof module:SdtdTicket
     */

    description: {
      type: 'string'
    },

    /**
     * @var title
     * @description Title of the ticket
     * @memberof module:SdtdTicket
     */

    title: {
      type: 'string',
      required: true
    },

    /**
     * @var status
     * @description Status of the ticket (open/closed)
     * @memberof module:SdtdTicket
     */

    status: {
      type: 'boolean',
      defaultsTo: true
    },

    /**
     * @var playerInfo
     * @description playerInfo at the time the ticket was created
     * @memberof module:SdtdTicket
     */

    playerInfo: {
      type: 'json'
    },

    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

    /**
     * @var server
     * @description Server this ticket belongs to
     * @memberof module:SdtdTicket
     */

    server: {
      model: 'sdtdserver',
      required: true,
    },

    /**
     * @var player
     * @description Player who made the ticket
     * @memberof module:SdtdTicket
     */

    player: {
      model: 'player',
      //allowNull: true
    },

    comments: {
      collection: 'ticketcomment',
      via: 'ticket'
    }

  },

};
