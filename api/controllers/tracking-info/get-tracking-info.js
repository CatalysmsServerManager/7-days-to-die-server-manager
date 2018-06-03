module.exports = {


    friendlyName: 'Get tracking info',


    description: '',


    inputs: {

        serverId: {
            type: 'number',
            required: true,
            custom: async (valueToCheck) => {
                let foundServer = await SdtdServer.findOne(valueToCheck);
                return foundServer
            },
        },

        playerId: {
            type: 'number',
            custom: async (valueToCheck) => {
                let foundPlayer = await Player.findOne(valueToCheck);
                return foundPlayer
            },
        }

    },


    exits: {
    },


    fn: async function (inputs, exits) {

        let infoToSend = await TrackingInfo.find({server: inputs.serverId, player: inputs.playerId});
        sails.log.debug(`Loaded ${infoToSend.length} records of player tracking data for server ${inputs.serverId}`);

        return exits.success(infoToSend);

    }


};
