/**
 * SdtdTicket.js
 *
 * @description Player-made tickets for admin support
 * @module SdtdTicket
 */

module.exports = {

    attributes: {
  
      commentText: {
        type: 'string',
        required: true,
        columnType: "TEXT CHARACTER SET utf8mb4"
      },
  
      //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
      //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
      //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
  
      ticket: {
        model: 'sdtdticket',
        required: true,
      },
  
      userThatPlacedTheComment: {
        model: 'user',
        required: true
      }
  
    },
  
  };
  