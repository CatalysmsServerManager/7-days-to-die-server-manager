var sevenDays = require('machinepack-7daystodiewebapi');

const SdtdApi = require('7daystodie-api-wrapper')

module.exports = {


    friendlyName: 'Validate item name',


    description: 'checks if a given item name is valid for a server',


    inputs: {

        serverId: {
            type: 'number',
            description: 'Id of the server',
            required: true
        },

        itemName: {
            type: 'string',
            description: 'Name of the item to check',
            required: true
        }

    },


    exits: {
        success: {
            outputFriendlyName: 'Success',
            outputType: 'boolean'
        },


    },



    fn: async function (inputs, exits) {

        let server = await SdtdServer.findOne(inputs.serverId);

        if (_.isUndefined(server)) {
            return exits.error(new Error("Invalid server"));
        }

        try {
            const itemsFound = (await sails.helpers.sdtdApi.executeConsoleCommand(server, `listitems ${inputs.itemName}`))
                .result
                .split('\n')
                .map(_ => _.trim());


            const itemFound = !!itemsFound.filter(_ => _ === inputs.itemName).length;


            return exits.success(itemFound);
        } catch (e) {
            exits.error(e);
        }

    }


};
