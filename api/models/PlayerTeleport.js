module.exports = {

  attributes: {

      //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
      //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
      //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

      name: {
          type: 'string',
          required: true
      },

      x: {
          type: 'number',
          required: true
      },

      y: {
          type: 'number',
          required: true
      },

      z: {
          type: 'number',
          required: true
      },

      timesUsed: {
        type: 'number',
        defaultsTo: 0
      },

      //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
      //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
      //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


      //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
      //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
      //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

      /**
       * @memberof PlayerTeleport
       * @var player
       * @description What player the teleport belongs to
       */
      player: {
          model: 'player',
          required: true
      },


  },

};
