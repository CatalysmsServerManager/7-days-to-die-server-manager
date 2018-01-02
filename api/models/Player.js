/**
 * Player.js
 *
 * @description A model definition.  Represents a ingame player
 * @module PlayerModel
 */

module.exports = {

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

    /**
    * @var {string} steamId
     */

    steamId: {
      type: 'string',
      required: true
    },

    /**
     * @var {number} entityId
     */

    entityId: {
      type: 'number'
    },

    /**
     * @var {string} ip
     * @description Last known IP address of the player
     */

    ip: {
      type: 'string',
      required: true
    },

    /**
     * @var {string} name
     */

    name: {
      type: 'string',
      required: true
    },

    /**
     * @var {number} positionX
     */

    positionX: {
      type: 'number'
    },

    /**
     * @var {number} positionY
     */

    positionY: {
      type: 'number'
    },

    /**
     * @var {number} positionZ
     */

    positionZ: {
      type: 'number'
    },

    /**
     * @var {json} inventory
     * @description Last known inventory
     */

    inventory: {
      type: 'json',
    },

    /**
     * @var {number} playtime
     * @description Total time the player has been online
     */

    playtime: {
      type: 'number'
    },

    /**
     * @var {string} lastOnline
     * @description When the player was last seen online
     */

    lastOnline: {
      type: 'string'
    },

    /**
     * @var {boolean} banned
     * @description Whether or not a player is banned
     * @default false
     */

    banned: {
      type: 'boolean',
      defaultsTo: false
    },


    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

    /**
     * @var server
     * @description What server the player belongs to
     */
    server: {
      model: 'sdtdServer'
    },

    /**
     * @var user
     * @description What user corresponds to a player
     */

    user: {
      model: 'user'
    }

  },

};
