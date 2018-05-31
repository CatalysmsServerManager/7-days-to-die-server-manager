module.exports = {


    friendlyName: 'Get memUpdate',

    inputs: {
        serverId: {
            required: true,
            example: 4
        },
        skip: {
            type: 'number',
            min: 0
        },
        limit: {
            type: 'number',
            min: 1
        }

    },

    exits: {
        badRequest: {
            responseType: 'badRequest'
        },

    },

    fn: async function (inputs, exits) {
        let dateStarted = new Date();

        let recordToSkip = inputs.skip ? inputs.skip : 0;
        let limitRecords = inputs.limit ? inputs.limit : 500;

        try {
            let dataToSend = await HistoricalInfo.find({
                where: {
                    server: inputs.serverId,
                    type: 'memUpdate'
                },
                sort: 'createdAt DESC',
                skip: recordToSkip,
                limit: limitRecords
            })
            let dateEnded = new Date();
            sails.log.debug(`Retrieved ${dataToSend.length} records of historical data - took ${dateEnded - dateStarted} ms`)
            return exits.success(dataToSend);
        } catch (error) {
            return exits.success(0)
        }
    }


};
