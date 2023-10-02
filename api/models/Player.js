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

    crossId: {
      type: 'string',
      allowNull: true
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

    country: {
      type: 'string',
      allowNull: true
    },


    currency: {
      type: 'number',
      defaultsTo: 0
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
      required: true,
      columnType: 'VARCHAR(255) CHARACTER SET utf8mb4'
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

    lastTeleportTime: {
      type: 'ref',
      defaultsTo: new Date()
    },

    lastDeathLocationX: {
      type: 'number',
      allowNull: true
    },

    lastDeathLocationY: {
      type: 'number',
      allowNull: true
    },

    lastDeathLocationZ: {
      type: 'number',
      allowNull: true
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
    },

    tickets: {
      collection: 'sdtdTicket',
      via: 'player'
    },

    teleports: {
      collection: 'playerTeleport',
      via: 'player'
    },

    role: {
      model: 'role'
    },

  },

};
