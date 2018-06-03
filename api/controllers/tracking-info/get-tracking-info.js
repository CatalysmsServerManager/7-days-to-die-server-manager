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
        },

        beginDate: {
            type: 'number',
            min: 0
        },

        endDate: {
            type: 'number',
            min: 0
        }

    },


    exits: {
    },


    fn: async function (inputs, exits) {

        inputs.beginDate = inputs.beginDate ? inputs.beginDate : new Date(0).valueOf();
        inputs.endDate = inputs.endDate ? inputs.endDate : Date.now();

        let infoToSend = await TrackingInfo.find({
            where: {
                server: inputs.serverId,
                player: inputs.playerId,
                createdAt: {
                    '>': inputs.beginDate,
                    '<': inputs.endDate,
                }
            },
            sort: "createdAt ASC"
        });
        sails.log.debug(`Loaded ${infoToSend.length} records of player tracking data for server ${inputs.serverId}`);

        return exits.success(infoToSend);

    }


};
