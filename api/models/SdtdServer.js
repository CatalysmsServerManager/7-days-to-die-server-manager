/**
 * SdtdServer.js
 *
 * @description :: Represents 7 Days to Die servers
 */

module.exports = {

    toJSON: function() {
        var obj = this.toObject();
        delete obj.telnetPassword;
        delete obj.authToken;
        delete obj.authName;
        return obj;
    },

    attributes: {

        //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
        //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
        //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

        name: {
            type: 'string'
        },

        ip: {
            type: 'string',
            required: true
        },

        gamePort: {
            type: 'number'
        },

        telnetPort: {
            type: 'number',
            required: true
        },

        telnetPassword: {
            type: 'string',
            required: true
        },

        webPort: {
            type: "number"
        },

        authName: {
            type: "string"
        },

        authToken: {
            type: "string"
        },

        // Info loaded from /getserverinfo

        description: {
            type: "string"
        },

        mapType: {
            type: "string"
        },

        version: {
            type: 'string'
        },

        maxPlayers: {
            type: 'number'
        },

        gameDifficulty: {
            type: "string"
        },

        dayNightLength: {
            type: 'number'
        },

        zombiesRun: {
            type: "number"
        },

        dropOnDeath: {
            type: "number"
        },

        playerKillingMode: {
            type: "number"
        },

        lootRespawnDays: {
            type: "number",
        },

        landClaimSize: {
            type: "number"
        },

        isPasswordProtected: {
            type: "boolean"
        },

        EACEnabled: {
            type: "boolean"
        },

        requiresMod: {
            type: "boolean"
        },

        //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
        //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
        //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


        //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
        //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
        //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

        owner: {
            model: "user",
            required: true
        },

        admins: {
            collection: "user",

        },

        players: {
            collection: "player",
            via: 'server'
        }

    },

};