/**
 * SdtdServer.js
 *
 * @description  Represents a 7 Days to Die server
 * @module SdtdServerModel
 */

module.exports = {

    customToJSON: function() {
        return _.omit(this, ['authToken', 'authName', 'telnetPort', 'telnetPassword']);
    },

    attributes: {

        //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
        //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
        //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

        /**
         * @var {string} name
         */

        name: {
            type: 'string'
        },

        /**
         * @var {string} ip
         */

        ip: {
            type: 'string',
            required: true
        },

        /**
         * @var {number} gamePort
         * @description Port used by players to join the game
         */

        gamePort: {
            type: 'number'
        },

        /**
         * @var {number} telnetPort
         */
        
        telnetPort: {
            type: 'number',
            required: true
        },

        /**
         * @var {string} telnetPassword
         * @deprecated Should not need to store telnet password - Will be removed soon(tm)
         */

        telnetPassword: {
            type: 'string',
            required: true
        },

        /**
         * @var {number} webPort
         * @description Port provided by Alloc's webserver
         */

        webPort: {
            type: 'number'
        },

        /**
         * @var {string} authName
         * @description adminuser to use during webrequests
         */

        authName: {
            type: 'string'
        },

        /**
         * @var {string} authToken
         * @description admintoken to use during webrequests
         */

        authToken: {
            type: 'string'
        },

        /**
         * @var {boolean} loggingEnabled
         * @description Whether or not logging is enabled
         * @default true
         */

        loggingEnabled: {
            type: 'boolean',
            defaultsTo: true
        },

        /**
         * @var {string} description
         * @description Description of the server
         */

        description: {
            type: 'string'
        },

        /**
         * @var {string} mapType
         * @description Navezgane or random gen
         */

        mapType: {
            type: 'string'
        },

        /**
         * @var {string} version
         * @description Game version the game is running on
         */

        version: {
            type: 'string'
        },

        /**
         * @var {number} maxPlayers
         * @description # player slots on the server
         */

        maxPlayers: {
            type: 'number'
        },

        /**
         * @var {string} gameDifficulty
         */

        gameDifficulty: {
            type: 'string'
        },

        /**
         * @var {number} dayNightLength
         */

        dayNightLength: {
            type: 'number'
        },

        /**
         * @var {number} zombiesRun
         * @description Wheter or not zombies should run
         */

        zombiesRun: {
            type: 'number'
        },

        /**
         * @var {number} dropOnDeath
         * @description What is dropped on death
         */

        dropOnDeath: {
            type: 'number'
        },

        /**
         * @var {number} playerKillingMode
         */

        playerKillingMode: {
            type: 'number'
        },

        /**
         * @var {number} lootRespawnDays
         * @description How many days until loot respawns
         */

        lootRespawnDays: {
            type: 'number',
        },

        /**
         * @var {number} landClaimSize
         */

        landClaimSize: {
            type: 'number'
        },

        /**
         * @var {boolean} isPasswordProtected
         */

        isPasswordProtected: {
            type: 'boolean'
        },

        /**
         * @var {boolean} EACEnabled
         * @description If anti cheat is enabled
         */

        EACEnabled: {
            type: 'boolean'
        },

        /**
         * @var {boolean} requiresMod
         * @description Are mods required to join the game?
         */

        requiresMod: {
            type: 'boolean'
        },

        //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
        //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
        //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


        //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
        //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
        //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

        /**
         * @var owner
         * @description Owner of the server, corresponds to a User
         */

        owner: {
            model: 'user',
            required: true
        },

        /**
         * @var admins
         * @description Users allowed to perform admin actions on the server
         */

        admins: {
            collection: 'user',
        },

        /**
         * @var players
         * @description Collection of Players that have logged on the server
         */

        players: {
            collection: 'player',
            via: 'server'
        }
    },

};