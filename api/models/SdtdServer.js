/**
 * SdtdServer.js
 *
 * @description  Represents a 7 Days to Die server
 * @class SdtdServer
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
         * @memberof SdtdServer
         * @var {string} name
         */

        name: {
            type: 'string'
        },

        /**
         * @var {string} ip
         * @memberof SdtdServer
         */

        ip: {
            type: 'string',
            required: true
        },

        /**
         * @memberof SdtdServer
         * @var {number} gamePort
         * @description Port used by players to join the game
         */

        gamePort: {
            type: 'number'
        },

        /**
         * @memberof SdtdServer
         * @var {number} telnetPort
         */
        
        telnetPort: {
            type: 'number',
            required: true
        },

        /**
         * @memberof SdtdServer
         * @var {string} telnetPassword
         * @deprecated Should not need to store telnet password - Will be removed soon(tm)
         */

        telnetPassword: {
            type: 'string',
            required: true
        },

        /**
         * @memberof SdtdServer
         * @var {number} webPort
         * @description Port provided by Alloc's webserver
         */

        webPort: {
            type: 'number'
        },

        /**
         * @memberof SdtdServer
         * @var {string} authName
         * @description adminuser to use during webrequests
         */

        authName: {
            type: 'string'
        },

        /**
         * @memberof SdtdServer
         * @var {string} authToken
         * @description admintoken to use during webrequests
         */

        authToken: {
            type: 'string'
        },

        /**
         * @memberof SdtdServer
         * @var {boolean} loggingEnabled
         * @description Whether or not logging is enabled
         * @default true
         */

        loggingEnabled: {
            type: 'boolean',
            defaultsTo: true
        },

        /**
         * @memberof SdtdServer
         * @var {string} description
         * @description Description of the server
         */

        description: {
            type: 'string'
        },

        /**
         * @memberof SdtdServer
         * @var {string} mapType
         * @description Navezgane or random gen
         */

        mapType: {
            type: 'string'
        },

        /**
         * @memberof SdtdServer
         * @var {string} version
         * @description Game version the game is running on
         */

        version: {
            type: 'string'
        },

        /**
         * @memberof SdtdServer
         * @var {number} maxPlayers
         * @description # player slots on the server
         */

        maxPlayers: {
            type: 'number'
        },

        /**
         * @memberof SdtdServer
         * @var {string} gameDifficulty
         */

        gameDifficulty: {
            type: 'string'
        },

        /**
         * @memberof SdtdServer
         * @var {number} dayNightLength
         */

        dayNightLength: {
            type: 'number'
        },

        /**
         * @memberof SdtdServer
         * @var {number} zombiesRun
         * @description Wheter or not zombies should run
         */

        zombiesRun: {
            type: 'number'
        },

        /**
         * @memberof SdtdServer
         * @var {number} dropOnDeath
         * @description What is dropped on death
         */

        dropOnDeath: {
            type: 'number'
        },

        /**
         * @memberof SdtdServer
         * @var {number} playerKillingMode
         */

        playerKillingMode: {
            type: 'number'
        },

        /**
         * @memberof SdtdServer
         * @var {number} lootRespawnDays
         * @description How many days until loot respawns
         */

        lootRespawnDays: {
            type: 'number',
        },

        /**
         * @memberof SdtdServer
         * @var {number} landClaimSize
         */

        landClaimSize: {
            type: 'number'
        },

        /**
         * @memberof SdtdServer
         * @var {boolean} isPasswordProtected
         */

        isPasswordProtected: {
            type: 'boolean'
        },

        /**
         * @memberof SdtdServer
         * @var {boolean} EACEnabled
         * @description If anti cheat is enabled
         */

        EACEnabled: {
            type: 'boolean'
        },

        /**
         * @memberof SdtdServer
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
         * @memberof SdtdServer
         * @var owner
         * @description Owner of the server, corresponds to a User
         */

        owner: {
            model: 'user',
            required: true
        },

        /**
         * @memberof SdtdServer
         * @var admins
         * @description Users allowed to perform admin actions on the server
         */

        admins: {
            collection: 'user',
        },

        /**
         * @memberof SdtdServer
         * @var players
         * @description Collection of Players that have logged on the server
         */

        players: {
            collection: 'player',
            via: 'server'
        }
    },

};