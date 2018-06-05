module.exports = {

    friendlyName: 'Remove admin',

    description: 'Remove a CSMM user as server admin',

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
     * @name removeAdmin
     * @method
     * @description Removes a user as admin of a server
     * @param {number} serverId ID of the server
     * @param {number} userId ID of the CSMM user
     */

    fn: async function (inputs, exits) {
        await SdtdServer.removeFromCollection(inputs.serverId, 'admins').members(inputs.userId);
        sails.log.info(`Removed admin for server ${inputs.serverId} - userId: ${inputs.userId}`)
        return exits.success();
    }
};
