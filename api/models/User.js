/**
 * User.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @module UserModel
 */

module.exports = {

    toJSON: function() {
        var obj = this.toObject();
        delete obj.encryptedPassword;
        return obj;
    },

    attributes: {

        //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
        //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
        //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

        /**
         * @var {string} steamId
         */

        steamId: {
            type: 'string',
            required: true,
            unique: true
        },

        /**
         * @var {string} username
         */

        username: {
            type: 'string',
            required: true,
            unique: true
        },

        /**
         * @var {boolean} admin
         * @description If a user can perform admin actions on the system
         * @default false
         */

        admin: {
            type: 'boolean',
            defaultsTo: false
        },

        /**
         * @var {boolean} banned
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

        players: {
            collection: 'player',
            via: 'user'
        },

        /**
         * @var servers
         * @description Servers this User owns
         */

        servers: {
            collection: 'sdtdServer',
            via: 'owner'
        },

    },

};