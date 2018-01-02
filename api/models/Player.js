/**
 * Player.js
 *
 * @description A model definition.  Represents a ingame player
 * @class Player
 */

module.exports = {

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

    /**
     * @var {string} steamId
     * @memberof Player
     */

    steamId: {
      type: 'string',
      required: true
    },

    /**
     * @var {number} entityId
     * @memberof Player
     */

    entityId: {
      type: 'number'
    },

    /**
     * @var {string} ip
     * @description Last known IP address of the player
     * @memberof Player
     */

    ip: {
      type: 'string',
      required: true
    },

    /**
     * @memberof Player
     * @var {string} name
     */

    name: {
      type: 'string',
      required: true
    },

    /**
     * @memberof Player
     * @var {number} positionX
     */

    positionX: {
      type: 'number'
    },

    /**
     * @memberof Player
     * @var {number} positionY
     */

    positionY: {
      type: 'number'
    },

    /**
     * @memberof Player
     * @var {number} positionZ
     */

    positionZ: {
      type: 'number'
    },

    /**
     * @memberof Player
     * @var {json} inventory
     * @description Last known inventory
     */

    inventory: {
      type: 'json',
    },

    /**
     * @memberof Player
     * @var {number} playtime
     * @description Total time the player has been online
     */

    playtime: {
      type: 'number'
    },

    /**
     * @memberof Player
     * @var {string} lastOnline
     * @description When the player was last seen online
     */

    lastOnline: {
      type: 'string'
    },

    /**
     * @memberof Player
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
     * @memberof Player
     * @var server
     * @description What server the player belongs to
     */
    server: {
      model: 'sdtdServer'
    },

    /**
     * @memberof Player
     * @var user
     * @description What user corresponds to a player
     */

    user: {
      model: 'user'
    }

  },

};
