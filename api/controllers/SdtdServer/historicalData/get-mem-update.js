module.exports = {


    friendlyName: 'Get memUpdate',

    inputs: {
        serverId: {
            required: true,
            example: 4
        }

    },

    exits: {
        badRequest: {
            responseType: 'badRequest'
        },

    },

    fn: async function (inputs, exits) {
        try {
            let dataToSend = await HistoricalInfo.find({
                where: {
                    server: inputs.serverId,
                    type: 'memUpdate'
                },
                limit: 5000
            })
            return exits.success(dataToSend);
        } catch (error) {
            return exits.success(0)
        }
    }


};
