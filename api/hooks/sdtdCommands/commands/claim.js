let SdtdCommand = require('../command.js');
const SdtdApi = require('7daystodie-api-wrapper');

class Claim extends SdtdCommand {
  constructor(serverId) {
    super(serverId, {
      name: 'claim',
      description: "Claim items you have bought in the shop",
      extendedDescription: "This command will drop the items at your feet. Best to do this in a safe location! You can claim a maximum of 10 items at a time. If you provide the list argument you will instead see a list of items you can claim.",
      aliases: ["claimitems"],
    });
    this.serverId = serverId;
  }

  async isEnabled(chatMessage, player, server, args) {
    return server.config.economyEnabled
  }

  async run(chatMessage, player, server, args) {
    let itemsToClaim = await PlayerClaimItem.find({
      player: player.id,
      claimed: false
    });

    if (args[0] === 'list') {

      chatMessage.reply(`There are ${itemsToClaim.length} items for you to claim`);
      itemsToClaim.forEach(item => {
        chatMessage.reply(`${item.amount}x ${item.name} of quality ${item.quality}`);
      });

      return;
    };
    const cpmVersion = await sails.helpers.sdtd.checkCpmVersion(this.serverId);

    if (itemsToClaim.length === 0) {
      return chatMessage.reply(`You have no items to claim!`);
    }

    if (itemsToClaim.length > 10) {
      chatMessage.reply('More than 10 items in queue, only the first 10 will be given.');
      itemsToClaim = itemsToClaim.slice(0, 10);
    }


    itemsToClaim.forEach(async item => {

      let cmdToExec;

      if (cpmVersion >= 6.4) {
        cmdToExec = `giveplus ${player.steamId} ${item.name} ${item.amount} ${item.quality ? item.quality + " 0" : ''}`;
      } else {
        cmdToExec = `give ${player.entityId} ${item.name} ${item.amount} ${item.quality ? item.quality : ''}`;
      }

      try {
        let response = await SdtdApi.executeConsoleCommand({
          ip: server.ip,
          port: server.webPort,
          adminUser: server.authName,
          adminToken: server.authToken
        }, cmdToExec);

        if (response.result.includes('ERR:')) {
          return chatMessage.reply(`Error while giving item - ${response.result}`);
        }

        chatMessage.reply(`Gave ${item.amount}x ${item.name} of quality ${item.quality}.`);
        await PlayerClaimItem.update({
          id: item.id
        }, {
          claimed: true
        });
      } catch (error) {
        chatMessage.reply(`Something went wrong while trying to give ${item.name}. Please contact a server admin.`);
      }

    });
  }
}

module.exports = Claim;
