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
      type: 'string',
      allowNull: true
    },

    // memUpdate info

    fps: {
      type: 'number',
      allowNull: true
    },

    heap: {
      type: 'number',
      allowNull: true
    },

    chunks: {
      type: 'number',
      allowNull: true
    },

    zombies: {
      type: 'number',
      allowNull: true
    },

    entities: {
      type: 'number',
      allowNull: true
    },

    players: {
      type: 'number',
      allowNull: true
    },

    items: {
      type: 'number',
      allowNull: true
    },

    rss: {
      type: 'number',
      allowNull: true
    },

    uptime: {
      type: 'number',
      allowNull: true
    },

    // Economy info

    amount: {
      type: 'number',
      allowNull: true
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

