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

    async run(chatMessage, player, server, args, options) {

        // Check if the player has exceeded the configured timeout
        if (this.options.timeout) {
            let dateNow = Date.now();
            let timeoutInMs = this.options.timeout * 1000
            let borderDate = new Date(dateNow.valueOf() - timeoutInMs);
            let foundUses = await PlayerUsedCommand.find({
                command: options.id,
                player: player.id,
                createdAt: {
                    '>': borderDate.valueOf()
                }
            });

            if (foundUses.length > 0) {
                return chatMessage.reply(`You need to wait longer before executing this command.`)
            }
        }

        // Deduct money if configured
        if (server.config.economyEnabled && this.options.costToExecute) {
            let notEnoughMoney = false
            let result = await sails.helpers.economy.deductFromPlayer.with({
                playerId: player.id,
                amountToDeduct: this.options.costToExecute,
                message: `COMMAND - ${this.options.name}`
            }).tolerate('notEnoughCurrency', totalNeeded => {
                notEnoughMoney = true;
            })
            if (notEnoughMoney) {
                return chatMessage.reply(`You do not have enough money to do that! ${this.options.name} costs ${this.options.costToExecute} ${server.config.currencyName}`)
            }
        }

        // If delayed, let the player know the command is about to be executed
        if (this.options.delay) {
            chatMessage.reply(`The command will be executed in ${this.options.delay} seconds`)
        }

        // Create a record of the player executing the command
        await PlayerUsedCommand.create({
            command: options.id,
            player: player.id
        });

        let delayInMs = this.options.delay * 1000
        setTimeout(function () {
            runCustomCommand(chatMessage, player, server, args, options)
        }, delayInMs)

        async function runCustomCommand(chatMessage, player, server, args, options) {
            try {
                let commandsToExecute = options.commandsToExecute.split(';');
                for (const command of commandsToExecute) {
                    let commandInfoFilledIn = command.replace('${entityId}', player.entityId)
                    commandInfoFilledIn = commandInfoFilledIn.replace('${steamId}', player.steamId)
                    await executeCommand(server, _.trim(commandInfoFilledIn))
                }
                sails.log.debug(`HOOK SdtdCommands - custom command ran by player ${player.name} on server ${server.name} - ${chatMessage.messageText}`)


            } catch (error) {
                chatMessage.reply(`Error! Contact your server admin with this message: ${error.replace(/\"/g,"")}`)
                sails.log.error(`Custom command error - ${server.name} - ${chatMessage.messageText} - ${error}`)
            }
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