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
            required: true,
            maxLength: 25
        }
    },

    exits: {
        success: {},
        badCommand: {
            responseType: 'badRequest'
        },

        badName: {
            responseType: 'badRequest'
        },

        maxCommands: {
            description: "User has added max amount of commands already",
            responseType: 'badRequest',
            statusCode: 400
          }

    },


    fn: async function (inputs, exits) {

        try {
            let server = await SdtdServer.findOne(inputs.serverId);
            let donatorRole = await sails.helpers.meta.checkDonatorStatus.with({ serverId: server.id });
            let allowedCommands = await getAllowedCommands(server);
            let amountOfExistingCommands = await CustomCommand.count({server: server.id});
            let maxCustomCommands = sails.config.custom.donorConfig[donatorRole].maxCustomCommands;

            if (amountOfExistingCommands >= maxCustomCommands) {
                return exits.maxCommands('You have set the maximum amount of commands for this server already. Consider deleting some, or donating :)');
            }


            if (inputs.commandName.includes(' ')) {
                return exits.badName('Name cannot have spaces');
            }

            let commandsToExecute = inputs.commandsToExecute.split(';');

            let badCommandFlag = false;
            let badCommandName;

            // Check if we can execute the entered commands
            commandsToExecute.forEach(command => {
                let splitMessage = command.split(' ');
                splitMessage = splitMessage.filter(el => el !== "");
                let idx = allowedCommands.findIndex(serverCommand => {
                    return serverCommand == splitMessage[0]
                });
                if (idx === -1) {
                    badCommandName = command;
                    badCommandFlag = true;
                }
            })

            if (badCommandFlag) {
                return exits.badCommand(`Invalid command! Make you provide valid, existing commands - ${badCommandName}`)
            }

            let commandsWithSameName = await CustomCommand.find({
                name: inputs.commandName,
                server: inputs.serverId
            })

            if (commandsWithSameName.length > 0) {
                return exits.badName('Invalid name! Please choose another one.')
            }


            let createdCommand = await CustomCommand.create({
                name: inputs.commandName,
                commandsToExecute: inputs.commandsToExecute,
                server: inputs.serverId
            })

            sails.log.info(`Created a custom command`, createdCommand)
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