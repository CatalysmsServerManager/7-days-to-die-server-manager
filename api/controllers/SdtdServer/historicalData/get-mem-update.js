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
                server: inputs.serverId,
                type: 'memUpdate'
            })
            return exits.success(dataToSend);
        } catch (error) {
            return exits.success(0)
        }
    }


};
