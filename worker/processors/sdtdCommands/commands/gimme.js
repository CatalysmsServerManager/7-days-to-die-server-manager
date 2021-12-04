const SdtdCommand = require('../command.js');
const SdtdApi = require('7daystodie-api-wrapper');

class Gimme extends SdtdCommand {
  constructor() {
    super({
      name: 'gimme',
      description: 'Get a random item, command or entity.',
      extendedDescription:
        'Get a random item, entity or command. An admin must configure possible items via the webinterface before you can use this command.',
      aliases: ['gimmie']
    });
  }

  async isEnabled(chatMessage, player, server) {
    return server.config.enabledGimme;
  }

  async run(chatMessage, player, server) {
    const cpmVersion = await sails.helpers.sdtd.checkCpmVersion(server.id);
    const possibleGimmeItems = await GimmeItem.find({
      server: server.id
    });

    let itemToUseIndex = await sails.helpers.etc.randomNumber(
      0,
      possibleGimmeItems.length - 1
    );
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
      sort: 'createdAt DESC',
      limit: 1
    });

    if (previousUse.length > 0) {
      let coolDownRemainderMs =
        cooldownInMs - (dateNow - previousUse[0].createdAt);
      let coolDownRemainderMin = Math.round(coolDownRemainderMs / 60000);
      return chatMessage.reply('gimmeCooldown', {
        coolDownRemainderMin: coolDownRemainderMin
      });
    }

    if (possibleGimmeItems.length === 0) {
      return chatMessage.reply('gimmeNoConfig');
    }

    if (server.config.economyEnabled && server.config.costToUseGimme) {
      let notEnoughMoney = false;

      try {
        await sails.helpers.economy.deductFromPlayer
          .with({
            playerId: player.id,
            amountToDeduct: server.config.costToUseGimme,
            message: `COMMAND - ${this.name}`
          });
      } catch (error) {
        notEnoughMoney = true;
      }

      if (notEnoughMoney) {
        return chatMessage.reply('notEnoughMoney', {
          cost: server.config.costToUseGimme
        });
      }
    }

    switch (itemToUse.type) {
      case 'item':
        let parsedItems = parseItem(itemToUse.value);
        for (const itemToGive of parsedItems) {
          let cmdToExec;

          if (cpmVersion >= 6.4) {
            cmdToExec = `giveplus ${player.entityId} ${itemToGive} 1`;
          } else {
            cmdToExec = `give ${player.entityId} ${itemToGive} 1`;
          }

          let response = await SdtdApi.executeConsoleCommand(
            {
              ip: server.ip,
              port: server.webPort,
              adminUser: server.authName,
              adminToken: server.authToken
            },
            cmdToExec
          );

          if (response.result.includes('ERR:')) {
            chatMessage.reply('error', { error: 'Error while executing give command' });
          }
        }
        break;

      case 'entity':
        let parsedEntities = parseEntity(itemToUse.value);
        for (const entity of parsedEntities) {
          let cmdToExec = `spawnentity ${player.entityId} ${entity}`;

          try {
            await SdtdApi.executeConsoleCommand(
              {
                ip: server.ip,
                port: server.webPort,
                adminUser: server.authName,
                adminToken: server.authToken
              },
              cmdToExec
            );
          } catch (error) {
            chatMessage.reply('error', { error: 'Error while executing give command' });
          }
        }
        break;

      case 'command':
        await sails.helpers.sdtd.executeCustomCmd(server, itemToUse.value, {
          player: player
        });

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

function parseEntity(value) {
  return value.split(';');
}

function parseItem(value) {
  return value.split(';');
}
