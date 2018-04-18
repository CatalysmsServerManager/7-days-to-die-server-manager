/**
 * HistoricalSystemInfo.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    // Type of info (memUpdate, inventory, location)
    type: {
      type: 'string',
      required: true,
      isIn: ['memUpdate', 'economy']
    },

    message: {
      type: 'string'
    },

    // memUpdate info

    fps: {
      type: 'number'
    },

    heap: {
      type: 'number'
    },

    chunks: {
      type: 'number'
    },

    zombies: {
      type: 'number'
    },

    entities: {
      type: 'number'
    },

    players: {
      type: 'number'
    },

    items: {
      type: 'number'
    },

    rss: {
      type: 'number'
    },

    uptime: {
      type: 'number'
    },

    // Economy info

    amount: {
      type: 'number'
    },

    economyAction: {
      type: 'string',
      isIn: ['give', 'deduct', 'config'],
      allowNull: true
    },




    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

    server: {
      model: 'sdtdserver',
      required: true
    },

    player: {
      model: 'player'
    },

  },

};

