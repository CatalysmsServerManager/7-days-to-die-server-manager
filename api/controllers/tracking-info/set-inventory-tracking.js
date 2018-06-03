module.exports = {


    friendlyName: 'Set inventory tracking',


    description: '',


    inputs: {

        serverId: {
            type: 'number',
            custom: async (valueToCheck) => {
                let foundServer = await SdtdServer.findOne(valueToCheck);
                return foundServer
            },
        },


        newStatus: {
            type: 'boolean'
        }

    },


    exits: {

    },


    fn: async function (inputs, exits) {

        await SdtdConfig.update({ server: inputs.serverId }, { inventoryTracking: inputs.newStatus });
        sails.log.info(`Set inventory tracking for server ${inputs.serverId} to ${inputs.newStatus}`);
        return exits.success();

    }


};
