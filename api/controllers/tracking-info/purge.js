module.exports = {


    friendlyName: 'Purge tracking info',


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

    },


    exits: {
    },


    fn: async function (inputs, exits) {

        let deletedInfo = await TrackingInfo.destroy({server: inputs.serverId}).fetch();
        sails.log.info(`Deleted ${deletedInfo.length} records of player tracking data for server ${inputs.serverId}`);

        return exits.success(deletedInfo);

    }


};
