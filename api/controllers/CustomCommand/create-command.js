var sevenDays = require('machinepack-7daystodiewebapi');

module.exports = {

    friendlyName: 'Create command',

    description: '',

    inputs: {
        serverId: {
            type: 'number',
            required: true
        },

        commandsToExecute: {
            type: 'ref',
            required: true
        },

        commandName: {
            type: 'string',
            required: true
        }
    },

    exits: {
        success: {},
        badCommand: {
            responseType: 'badRequest'
        }

    },


    fn: async function (inputs, exits) {

        try {
            let server = await SdtdServer.findOne(inputs.serverId);
            let allowedCommands = await getAllowedCommands(server);

            let commandsToExecute = inputs.commandsToExecute.split(';');

            let badCommandFlag = false;

            // Check if we can execute the entered commands
            commandsToExecute.forEach(command => {
                let splitMessage = command.split(' ');
                console.log(splitMessage)
                let idx = allowedCommands.findIndex(serverCommand => {
                    return serverCommand == splitMessage[0]
                });

                console.log(idx)

                if (idx === -1) {
                    console.log('bad cmd detected');
                    badCommandFlag = true;
                }

            })

            if (badCommandFlag) {
                return exits.badCommand('Invalid command! Make you provide valid, existing commands')
            }

            let createdCommand = await sails.models.customcommand.create({
                name: inputs.commandName,
                commandsToExecute: inputs.commandsToExecute,
                server: inputs.serverId
            })
            console.log('exiting success')
            return exits.success(createdCommand);



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
                let allowedCommands = new Array();
                response.commands.forEach(command => {
                    allowedCommands.push(command.command)
                })
                resolve(allowedCommands);
            }
        })
    })
}