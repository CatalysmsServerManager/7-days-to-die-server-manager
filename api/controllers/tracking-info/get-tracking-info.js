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
        },

        limit: {
            type: 'number',
            min: 1,
            max: 5000
        }

    },


    exits: {
    },


    fn: async function (inputs, exits) {

        let startDate = new Date();

        inputs.beginDate = inputs.beginDate ? inputs.beginDate : new Date(0).valueOf();
        inputs.endDate = inputs.endDate ? inputs.endDate : Date.now();
        inputs.limit = inputs.limit ? inputs.limit : 5000

        let infoToSend = await TrackingInfo.find({
            where: {
                server: inputs.serverId,
                player: inputs.playerId,
                createdAt: {
                    '>': inputs.beginDate,
                    '<': inputs.endDate,
                }
            },
            sort: "createdAt ASC",
            limit: inputs.limit

        });

        let endDate = new Date();
        sails.log.info(`Loaded ${infoToSend.length} records of player tracking data for server ${inputs.serverId} - Took ${endDate.valueOf() - startDate.valueOf()} ms`);

        return exits.success(infoToSend);

    }


};
