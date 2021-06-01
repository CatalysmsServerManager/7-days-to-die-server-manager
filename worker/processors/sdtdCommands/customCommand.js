const SdtdCommand = require('./command.js');
const wait = require('../../util/wait').wait;

class CustomCommand extends SdtdCommand {
  constructor(command) {
    super({
      name: 'customCommand',
    });
    this.options = command;
  }

  async isEnabled() {
    return true;
  }

  async run(chatMessage, player, server, args, options) {
    let argumentIterator = 0;
    let playerRole = await sails.helpers.sdtd.getPlayerRole(player.id);

    if (playerRole.level > this.options.level) {
      return chatMessage.reply(`You do not have the correct role to execute this command. Ask your server admin for elevated permissions.`);
    }

    for (const argument of options.arguments) {
      let valueToFill = args[argumentIterator];
      let validArg = validateArg(argument, valueToFill);

      if (!validArg) {
        return chatMessage.reply(`You provided an invalid value! '${valueToFill}' is not valid for ${argument.key}`);
      }



      if (_.isUndefined(valueToFill) && !_.isUndefined(argument.defaultValue)) {
        valueToFill = argument.defaultValue;
      }


      options.commandsToExecute = replaceAllInString(options.commandsToExecute, `\${${argument.key}}`, valueToFill);
      argumentIterator++;
    }

    // Check if the player has exceeded the configured timeout
    if (this.options.timeout) {
      let dateNow = Date.now();
      let timeoutInMs = this.options.timeout * 1000;
      let borderDate = new Date(dateNow.valueOf() - timeoutInMs);
      let foundUses = await PlayerUsedCommand.find({
        command: options.id,
        player: player.id,
        createdAt: {
          '>': borderDate.valueOf()
        }
      });

      if (foundUses.length > 0) {
        return chatMessage.reply(`You need to wait longer before executing this command.`);
      }
    }

    // Deduct money if configured
    if (server.config.economyEnabled && this.options.costToExecute) {
      let notEnoughMoney = false;

      try {
        await sails.helpers.economy.deductFromPlayer.with({
          playerId: player.id,
          amountToDeduct: this.options.costToExecute,
          message: `COMMAND - ${this.options.name}`
        });
      } catch (error) {
        notEnoughMoney = true;
      }

      if (notEnoughMoney) {
        return chatMessage.reply(`You do not have enough money to do that! ${this.options.name} costs ${this.options.costToExecute} ${server.config.currencyName}`);
      }
    }



    // Create a record of the player executing the command
    await PlayerUsedCommand.create({
      command: options.id,
      player: player.id
    });

    // If delayed, let the player know the command is about to be executed
    if (this.options.delay) {
      await chatMessage.reply(`The command will be executed in ${this.options.delay} seconds`);
      await wait(this.options.delay);
    }

    await runCustomCommand(chatMessage, player, server, args, options);

    async function runCustomCommand(chatMessage, player, server, args, options) {
      try {
        let executedCmds = await sails.helpers.sdtd.executeCustomCmd(server, options.commandsToExecute, {
          player: player,
          command: options
        });

        if (options.sendOutput) {

          for (const cmd of executedCmds) {
            if (!_.isEmpty(cmd.result)) {
              await chatMessage.reply(cmd.result);
            }
          }
        }

        sails.log.debug(`HOOK SdtdCommands - custom command ran by player ${player.name} on server ${server.name} - ${chatMessage.messageText}`, chatMessage, executedCmds);


      } catch (error) {
        sails.log.error(`Custom command error - server ${server.id} - ${chatMessage.messageText}`);
        sails.log.error(error);
        chatMessage.reply(`Error, please contact your server admin!`);
      }
    }
  }
}

module.exports = CustomCommand;

function replaceAllInString(string, search, replacement) {
  return string.split(search).join(replacement);
}

function validateArg(argumentRecord, value) {

  if (argumentRecord.required && _.isUndefined(value)) {
    return false;
  }

  // TODO: validate argument types
  switch (argumentRecord.type) {
    case 'number':
      //let parsed = parseInt(value);
      //return !isNaN(parsed);
      return true;
      break;
    case 'text':
      return true;
      break;

    default:
      return true;
      break;
  }
}
