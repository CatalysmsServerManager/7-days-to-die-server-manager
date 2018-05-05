var sevenDays = require('machinepack-7daystodiewebapi');

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

        sevenDays.listItems({
            ip: server.ip,
            port: server.webPort,
            authName: server.authName,
            authToken: server.authToken,
            itemToSearch: inputs.item
        }).exec({
            success: (response) => {
                let foundItem = false

                response.map(itemName => {

                    if (itemName === inputs.itemName) {
                        foundItem = true
                    }
                })

                return exits.success(foundItem)
            },
            error: (error) => {
                return exits.success(false)
            }
        });


    }


};
