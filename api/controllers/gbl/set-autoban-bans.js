module.exports = {


    friendlyName: 'set autoban bans',


    description: 'Set the amount of bans needed for GBL autoban',


    inputs: {
        serverId: {
            required: true,
            type: 'string'
        },
        bans: {
            required: true,
            type: 'number',
            min: 1
        }
    },


    exits: {

        notFound: {
            description: 'Server with given ID not found in the system',
            responseType: 'notFound'
        },

    },

    fn: async function (inputs, exits) {

        sails.log.info(`Setting amount of bans for GBL autoban to ${inputs.bans} for server ${inputs.serverId}`);

        await SdtdConfig.update({server: inputs.serverId}, {gblAutoBanBans: inputs.bans});

        return exits.success();

    }


};
