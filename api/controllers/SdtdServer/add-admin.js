module.exports = {

    friendlyName: 'Add admin',

    description: 'Register a CSMM user as server admin',

    inputs: {
        serverId: {
            type: 'number',
            required: true
        },
        userId: {
            type: 'number',
            required: true
        }
    },

    exits: {
        success: {
        },
        notFound: {
            description: 'No server/user with the specified ID was found in the database.',
            responseType: 'notFound'
        }
    },

    /**
     * @memberof SdtdServer
     * @name sendMessage
     * @method
     * @description sends a message on a 7dtd server
     * @param {number} serverId ID of the server
     * @param {number} userId ID of the CSMM user
     */

    fn: async function (inputs, exits) {
        await SdtdServer.addToCollection(inputs.serverId, 'admins').members(inputs.userId);
        return exits.success();

    }
};
