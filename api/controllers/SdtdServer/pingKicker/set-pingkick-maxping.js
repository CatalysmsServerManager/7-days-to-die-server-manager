module.exports = {


    friendlyName: 'set ping kicker max ping',


    description: '',


    inputs: {
        serverId: {
            required: true,
            type: 'string'
        },
        maxPing: {
            required: true,
            type: 'number',
        }
    },


    exits: {

        notFound: {
            description: 'Server with given ID not found in the system',
            responseType: 'notFound'
        },

    },

    fn: async function (inputs, exits) {

        sails.log.info(`Setting max ping of pingKicker to ${inputs.maxPing} for server ${inputs.serverId}`);

        await SdtdConfig.update({server: inputs.serverId}, {maxPing: inputs.maxPing});

        return exits.success();

    }


};
