let SdtdCommand = require('../command.js');
const SdtdApi = require('7daystodie-api-wrapper');

class Claim extends SdtdCommand {
  constructor(serverId) {
    super(serverId, {
      name: 'claim',
      description: 'Claim items you have bought in the shop',
      extendedDescription: 'This command will drop the items at your feet. Best to do this in a safe location! You can claim a maximum of 10 items at a time. If you provide the list argument you will instead see a list of items you can claim.',
      aliases: ['claimitems'],
    });
    this.serverId = serverId;
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

      chatMessage.reply('claimList', {
        totalItems: itemsToClaim.length
      });
      itemsToClaim.forEach(item => {
        chatMessage.reply(`${item.amount}x ${item.name} - Quality: ${item.quality}`);
      });

      return;
    };
    const cpmVersion = await sails.helpers.sdtd.checkCpmVersion(this.serverId);

    if (itemsToClaim.length === 0) {
      return chatMessage.reply('claimNoItems');
    }

    if (itemsToClaim.length > 10) {
      chatMessage.reply('claimFullQueue', {
        totalItems: itemsToClaim.length
      });
      itemsToClaim = itemsToClaim.slice(0, 10);
    }


    itemsToClaim.forEach(async item => {

      let cmdToExec;

      if (cpmVersion >= 6.4) {
        cmdToExec = `giveplus ${player.steamId} "${item.name}" ${item.amount} ${item.quality ? item.quality + ' 0' : ''}`;
      } else {
        cmdToExec = `give ${player.entityId} "${item.name}" ${item.amount} ${item.quality ? item.quality : ''}`;
      }

      try {
        let response = await SdtdApi.executeConsoleCommand({
          ip: server.ip,
          port: server.webPort,
          adminUser: server.authName,
          adminToken: server.authToken
        }, cmdToExec);

        if (response.result.includes('ERR:')) {
          return chatMessage.reply('error', { error: response.result });
        }

        chatMessage.reply('claimItemGiven', {
          item: item
        });
        await PlayerClaimItem.update({
          id: item.id
        }, {
          claimed: true
        });
      } catch (error) {
        chatMessage.reply('error', { error: error });
      }

    });
  }
}

module.exports = Claim;
