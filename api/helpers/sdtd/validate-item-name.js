var sevenDays = require('7daystodie-api-wrapper');

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
            return exits.success(false);
        }

        const response = await sevenDays.executeConsoleCommand(SdtdServer.getAPIConfig(server), `listitems ${inputs.itemName}`);

        let items = new Array();

        let splitResult = response.result.split(/\r?\n/)

        splitResult.forEach((element) => {
          element = element.trim()
          items.push(element);
        })
        items = items.slice(0, items.length-2);

        return exits.success(!!response.find(itemName => itemName === inputs.itemName));
    }
};
