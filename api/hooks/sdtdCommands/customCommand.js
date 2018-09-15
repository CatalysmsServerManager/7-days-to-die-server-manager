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

  async isEnabled(chatMessage, player, server, args) {
    return true
  }

  async run(chatMessage, player, server, args, options) {
    let argumentIterator = 0;
    let playerRole = await sails.helpers.sdtd.getPlayerRole(player.id);

    if (playerRole.level > this.options.level) {
      return chatMessage.reply(`You do not have the correct role to execute this command. Ask your server admin for elevated permissions.`)
    }

    for (const argument of options.arguments) {
      let valueToFill = args[argumentIterator];
      let validArg = validateArg(argument, valueToFill);

      if (!validArg) {
        return chatMessage.reply(`You provided an invalid value! '${valueToFill}' is not valid for ${argument.key}`)
      }

      

      if (_.isUndefined(valueToFill) && !_.isUndefined(argument.defaultValue)) {
        valueToFill = argument.defaultValue
      }

      options.commandsToExecute = options.commandsToExecute.replace("${" + argument.key + "}", valueToFill);
      argumentIterator++
    }

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
      let commandsExecuted = new Array();
      try {
        let commandsToExecute = options.commandsToExecute.split(';');
        for (const command of commandsToExecute) {
          let commandInfoFilledIn = command.replace('${entityId}', player.entityId)
          commandInfoFilledIn = commandInfoFilledIn.replace('${steamId}', player.steamId)
          let commandResult = await executeCommand(server, _.trim(commandInfoFilledIn));
          commandsExecuted.push(commandResult);

          if (options.sendOutput) {
            await chatMessage.reply(commandResult.result);
          }

        }
        sails.log.debug(`HOOK SdtdCommands - custom command ran by player ${player.name} on server ${server.name} - ${chatMessage.messageText}`, chatMessage, commandsExecuted);


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


function validateArg(argumentRecord, value) {

  if (argumentRecord.required && _.isUndefined(value)) {
    return false
  }

  switch (argumentRecord.type) {
    case 'number':
      let parsed = parseInt(value)
      //return !isNaN(parsed);
      return true
      break;
    case 'text':
      return true;
      break;

    default:
      return true
      break;
  }
}
