module.exports = {


    friendlyName: 'load bans',


    description: 'Load bans for a server',


    inputs: {

        serverId: {
            required: true,
            type: 'number',
            custom: async function (valueToCheck) {
                let foundServer = await SdtdServer.findOne(valueToCheck);
                return foundServer
            }
        },

    },


    exits: {

    },


    fn: async function (inputs, exits) {

        let serverBans = await sails.helpers.sdtd.loadBans(inputs.serverId);

        return exits.success(serverBans);

    }


};
