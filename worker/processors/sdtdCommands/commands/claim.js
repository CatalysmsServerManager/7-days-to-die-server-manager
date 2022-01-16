const SdtdCommand = require('../command.js');

// This prevents a player from spamming the command
// And effectively duplicating items
const locks = {};
class Claim extends SdtdCommand {
  constructor() {
    super({
      name: 'claim',
      description: 'Claim items you have bought in the shop',
      extendedDescription: `If you do not have CPM installed, this command will drop the items at your feet. Best to do this in a safe location!
      If you provide the list argument you will instead see a list of items you can claim. "$claim list"
      If you pass a number as argument, you will claim that many items, "$claim 5" will claim the first 5 items in your queue`,
      aliases: ['claimitems'],
    });
  }

  async isEnabled(chatMessage, player, server) {
    return server.config.economyEnabled;
  }

  async run(chatMessage, player, server, args) {
    let itemsToClaim = await PlayerClaimItem.find({
      player: player.id,
      claimed: false
    });

    if (args[0] === 'list') {

      await chatMessage.reply('claimList', {
        totalItems: itemsToClaim.length
      });

      for (const item of itemsToClaim) {
        await chatMessage.reply(`${item.amount}x ${item.name} - Quality: ${item.quality}`);
      }
      return;
    };

    const cpmVersion = await sails.helpers.sdtd.checkCpmVersion(server.id);

    if (itemsToClaim.length === 0) {
      return chatMessage.reply('claimNoItems');
    }

    const amountToClaim = isNaN(parseInt(args[0], 10)) ? 10 : parseInt(args[0], 10);

    itemsToClaim = itemsToClaim.slice(0, amountToClaim);

    if (locks[player.id]) {
      return chatMessage.reply('claimLock');
    }

    locks[player.id] = true;

    try {
      for (const item of itemsToClaim) {
        let cmdToExec;

        if (cpmVersion >= 6.4) {
          cmdToExec = `giveplus ${player.entityId} "${item.name}" ${item.amount} ${item.quality ? item.quality + ' 0' : ''}`;
        } else {
          cmdToExec = `give ${player.entityId} "${item.name}" ${item.amount} ${item.quality ? item.quality : ''}`;
        }

        const response = await sails.helpers.sdtdApi.executeConsoleCommand({
          ip: server.ip,
          port: server.webPort,
          adminUser: server.authName,
          adminToken: server.authToken
        }, cmdToExec);

        if (response.result.includes('ERR:')) {
          sails.log.error(`Error when giving an item via the claim command! Response result: ${response.result}`, {server, player});
          return chatMessage.reply('error', { error: 'Error while executing give command' });
        }

        await PlayerClaimItem.update({
          id: item.id
        }, {
          claimed: true
        });

        await chatMessage.reply('claimItemGiven', {
          item: item
        });

      }
    } catch (error) {
      sails.log.error(error, {server, player});
      await chatMessage.reply('error', { error: 'Error while handling your claimed items' });
    } finally {
      delete locks[player.id];
    }

  }
}

module.exports = Claim;
