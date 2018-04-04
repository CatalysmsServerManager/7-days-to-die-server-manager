/**
 * User.js
 *
 * @description Represents a user of the system
 * @class User
 */

module.exports = {

  toJSON: function () {
    var obj = this.toObject();
    delete obj.encryptedPassword;
    return obj;
  },

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

    /**
     * @memberof User
     * @var {string} steamId
     */

    steamId: {
      type: 'string',
      unique: true,
      required: true
    },

    /**
     * memberof User
     * @var {string} discordId
     */

    discordId: {
      type: 'string'
    },

    /**
     * @memberof User
     * @var {string} username
     */

    username: {
      type: 'string',
      required: true,
      unique: true
    },

    avatar: {
      type: 'string'
    },

    /**
     * @var {boolean} admin
     * @memberof User
     * @description If a user can perform admin actions on the system
     * @default false
     */

    admin: {
      type: 'boolean',
      defaultsTo: false
    },

    /**
     * @var {boolean} banned
     * @memberof User
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
     * @var players
     * @description Ingame Players corresponding to a user
     * @memberof User
     */

    players: {
      collection: 'player',
      via: 'user'
    },

    /**
     * @var servers
     * @description Servers this User owns
     * @memberof User
     */

    servers: {
      collection: 'sdtdServer',
      via: 'owner'
    },

    adminOf: {
      collection: 'sdtdServer',
      via: 'admins'
    }

  },

};
