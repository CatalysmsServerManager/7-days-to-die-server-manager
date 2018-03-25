/**
 * Player.js
 *
 * @description A model definition.  Represents a ingame player
 * @class Player
 * @param {number} steamId
 * @param {number} entityId
 */

module.exports = {

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

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
      type: 'string'
    },

    /**
     * @var {string} avatarUrl
     * @description Url of the players' steam avatar
     * @memberOf Player
     */

    avatarUrl: {
      type: 'string'
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

    /**
     * @memberof Player
     * @var {number} deaths
     * @description How many times has the player died
     * @default 0
     */

    deaths: {
      type: 'number',
      defaultsTo: 0
    },

    /**
     * @memberof Player
     * @var {number} zombieKills
     * @description How many zombies the player has killed
     * @default 0
     */

    zombieKills: {
      type: 'number',
      defaultsTo: 0
    },

    /**
     * @memberof Player
     * @var {number} playerKills
     * @description How many players the player has killed
     * @default 0
     */

    playerKills: {
      type: 'number',
      defaultsTo: 0
    },

    /**
     * @memberof Player
     * @var {number} score
     * @description Players score
     * @default 0
     */

    score: {
      type: 'number',
      defaultsTo: 0
    },

    /**
     * @memberof Player
     * @var {number} level
     * @description The players level
     * @default 0
     */

    level: {
      type: 'number',
      defaultsTo: 0
    },

    // {
    //   name: 'xxx',
    //   x: "",
    //   y: '',
    //   z: ''
    // }

    teleportLocations: {
      type: 'json',
      columnType: 'array'
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
