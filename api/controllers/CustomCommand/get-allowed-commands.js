var sevenDays = require('machinepack-7daystodiewebapi');

module.exports = {

    friendlyName: 'Get allowed commands',

    description: '',

    inputs: {
        serverId: {
            type: 'number',
            required: true
        },
    },

    exits: {
        success: {},

    },


    fn: async function (inputs, exits) {

        try {
            let server = await SdtdServer.findOne(inputs.serverId);
            let allowedCommands = await getAllowedCommands(server);

            return exits.success(allowedCommands);

        } catch (error) {
            sails.log.error(`${error}`);
            return exits.error(error);
        }


    }
};


function getAllowedCommands(server) {
    return new Promise((resolve, reject) => {
        sevenDays.getAllowedCommands({
            ip: server.ip,
            port: server.webPort,
            authName: server.authName,
            authToken: server.authToken
        }).exec({
            error: error => {
                reject(error)
            },
            success: response => {
                resolve(response);
            }
        })
    })
}