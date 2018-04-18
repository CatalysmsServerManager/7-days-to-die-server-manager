let SdtdCommand = require('./command.js');
const sevenDays = require('machinepack-7daystodiewebapi');

class CustomCommand extends SdtdCommand {
    constructor(serverId, command) {
        super(serverId, {
            name: 'customCommand',
        });
        this.serverId = serverId;
        this.options = command
    }

    async run(chatMessage, player, server, args) {
        console.log(this.options)


        if (this.options.costToExecute) {
            console.log("TODO: HANDLE CUSTOM COMMAND COST")
        }

        try {
            let commandsToExecute = this.options.commandsToExecute.split(';');
            for (const command of commandsToExecute) {
                let commandInfoFilledIn = command.replace('${entityId}', player.entityId)
                await executeCommand(server, commandInfoFilledIn)
            }
            sails.log.info(`HOOK SdtdCommands - custom command ran by player ${player.name} on server ${server.name} - ${chatMessage.messageText}`)


        } catch (error) {
            sails.log.error(`Custom command error - ${error}`)
        }


    }
}

module.exports = CustomCommand;


function executeCommand(server, command) {
    return new Promise((resolve, reject) => {
        sevenDays.executeCommand({
            ip: server.ip,
            port: server.webPort,
            authName: server.authName,
            authToken: server.authToken,
            command: command
        }).exec({
            success: (response) => {
                console.log(response)
                resolve(response);
            },
            unknownCommand: (error) => {
                reject(error)
            },
            error: (error) => {
                reject(error)
            }
        });
    })
}