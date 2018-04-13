/**
 * HistoricalSystemInfo.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

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


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

    server: {
      model: 'sdtdserver',
      required: true
    },

  },

};

