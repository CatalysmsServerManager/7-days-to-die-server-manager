let SdtdCommand = require('../command.js');
const SdtdApi = require('7daystodie-api-wrapper');

class Gimme extends SdtdCommand {
  constructor(serverId) {
    super(serverId, {
      name: 'gimme',
      description: "Get some random item. GIMME GIMME",
      extendedDescription: "Get a random item, entity or command. An admin must configure possible items via the webinterface before you can use this command."
    });
    this.serverId = serverId;
  }

  async isEnabled(chatMessage, player, server, args) {
    return server.config.enabledGimme;
  }


  async run(chatMessage, player, server, args) {

    const cpmVersion = await sails.helpers.sdtd.checkCpmVersion(this.serverId);
    const possibleGimmeItems = await GimmeItem.find({
      server: server.id
    });

    let itemToUseIndex = await sails.helpers.etc.randomNumber(0, possibleGimmeItems.length - 1);
    let itemToUse = possibleGimmeItems[itemToUseIndex];

    let dateNow = Date.now();
    let cooldownInMs = server.config.gimmeCooldown * 60000; // Convert minutes to ms
    let borderDate = new Date(dateNow.valueOf() - cooldownInMs);

    const previousUse = await PlayerUsedGimme.find({
      where: {
        player: player.id,
        createdAt: {
          '>': borderDate.valueOf()
        }
      },
      sort: "createdAt DESC",
      limit: 1
    });

    if (previousUse.length > 0) {
      let coolDownRemainderMs = cooldownInMs - (dateNow - previousUse[0].createdAt);
      return chatMessage.reply(`You need to wait ${Math.round(coolDownRemainderMs / 60000)} minutes more before executing this command again.`);
    }

    if (possibleGimmeItems.length === 0) {
      return chatMessage.reply(`Found 0 configured items. An admin must configure some via the webinterface before this command will work!`);
    }


    if (server.config.economyEnabled && server.config.costToUseGimme) {
      let notEnoughMoney = false
      await sails.helpers.economy.deductFromPlayer.with({
        playerId: player.id,
        amountToDeduct: server.config.costToUseGimme,
        message: `COMMAND - ${this.name}`
      }).tolerate('notEnoughCurrency', totalNeeded => {
        notEnoughMoney = true;
      });
      if (notEnoughMoney) {
        return chatMessage.reply(`You do not have enough money to do that! This action costs ${server.config.costToUseGimme} ${server.config.currencyName}`);
      }
    }



    switch (itemToUse.type) {

      case "item":

        let parsedItems = parseItem(itemToUse.value);
        for (const itemToGive of parsedItems) {
          let cmdToExec;

          if (cpmVersion >= 6.4) {
            cmdToExec = `giveplus ${player.steamId} ${itemToGive} 1`;
          } else {
            cmdToExec = `give ${player.entityId} ${itemToGive} 1`;
          }

          try {
            let response = await SdtdApi.executeConsoleCommand({
              ip: server.ip,
              port: server.webPort,
              adminUser: server.authName,
              adminToken: server.authToken
            }, cmdToExec);

            if (response.result.includes("ERR:")) {
              chatMessage.reply(`Error while giving an item! Please report this to a server admin - ${response.result}`);
            }
          } catch (error) {
            chatMessage.reply(`Error while giving an item! Please report this to a server admin - ${error}`);
          }
        }
        break;

      case "entity":

        let parsedEntities = parseEntity(itemToUse.value);
        for (const entity of parsedEntities) {
          let cmdToExec = `spawnentity ${player.entityId} ${entity}`;

          try {
            let response = await SdtdApi.executeConsoleCommand({
              ip: server.ip,
              port: server.webPort,
              adminUser: server.authName,
              adminToken: server.authToken
            }, cmdToExec);

          } catch (error) {
            chatMessage.reply(`Error while spawning an entity! Please report this to a server admin - ${error}`);
          }
        }
        break;

      case "command":

        let parsedCommands = parseCommand(itemToUse.value, player);

        for (const cmdToExec of parsedCommands) {
          try {
            let response = await SdtdApi.executeConsoleCommand({
              ip: server.ip,
              port: server.webPort,
              adminUser: server.authName,
              adminToken: server.authToken
            }, cmdToExec.trim());

          } catch (error) {
            chatMessage.reply(`Error while executing a command! Please report this to a server admin - ${error}`);
          }
        }

        break;

      default:
        break;
    }

    chatMessage.reply(itemToUse.friendlyName);

    await PlayerUsedGimme.create({
      item: itemToUse.id,
      player: player.id
    });

  }

}

module.exports = Gimme;

function parseCommand(commandString, player) {
  let commandInfoFilled = replaceAllInString(commandString, "${steamId}", player.steamId);
  commandInfoFilled = replaceAllInString(commandInfoFilled, "${entityId}", player.entityId);
  commandInfoFilled = replaceAllInString(commandInfoFilled, "${playerName}", player.name);
  return commandInfoFilled.split(";");
}

function parseEntity(value) {
  return value.split(";");
}

function parseItem(value) {
  return value.split(';');
}

function replaceAllInString(string, search, replacement) {
  return string.split(search).join(replacement);
}
