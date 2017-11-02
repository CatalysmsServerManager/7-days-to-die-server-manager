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

        //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
        //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
        //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


        //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
        //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
        //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

        loggingEnabled: {
            type: "boolean",
            defaultsTo: false
        },

        owner: {
            model: "user",
            required: true
        },

        admins: {
            collection: "user",

        }

    },

};