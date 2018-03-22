module.exports = {

    friendlyName: 'is online',

    description: 'Check if a server is online or not',

    inputs: {

        serverId: {
            description: 'Id of the SdtdServer',
            type: 'number',
            required: true
        }

    },

    exits: {

        success: {},


    },

    /**
     * @memberof SdtdServer
     * @name is-online
     * @method
     * @description Check if a server is online & available
     * @param {string} serverId ID of the server 
     */

    fn: async function (inputs, exits) {
        let status = await sails.helpers.sdtd.checkIfAvailable(inputs.serverId);
        return exits.success(status);

    }
};
