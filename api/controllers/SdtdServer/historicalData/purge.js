module.exports = {


    friendlyName: 'Purge',

    inputs: {
        serverId: {
            required: true,
            example: 4
        },
        type: {
            type: 'string',
            in: ['economy', 'memUpdate'],
            required: true
        },


    },

    exits: {

    },

    fn: async function (inputs, exits) {

        let deletedRecords = await HistoricalInfo.destroy({
            server: inputs.serverId,
            type: inputs.type
        }).fetch();

        sails.log.info(`Deleted ${deletedRecords.length} ${inputs.type} records for server ${inputs.serverId}`);

        return exits.success();

    }


};
