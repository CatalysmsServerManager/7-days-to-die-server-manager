let SdtdCommand = require('../command.js');
const SdtdApi = require('7daystodie-api-wrapper');

class Shop extends SdtdCommand {
  constructor(serverId) {
    super(serverId, {
      name: 'shop',
      description: "Ingame shop",
      extendedDescription: "",
      aliases: ['store']
    });
    this.serverId = serverId;
  }

  async isEnabled(chatMessage, player, server, args) {
    return server.config.economyEnabled;
  }

  async _buyItem(listing, player, server, chatMessage) {
    const cpmVersion = await sails.helpers.sdtd.checkCpmVersion(this.serverId);
    let cmdToExec;

    
    if (player.currency < listing.price) {
        return chatMessage.reply(`You do not have enough ${server.config.currencyName} to buy this. You need ${listing.price - player.currency} more`);
      }

      await sails.helpers.economy.deductFromPlayer(player.id, listing.price, `SHOP - INGAME - bought ${listing.name}`);


    if (cpmVersion >= 6.4) {
      cmdToExec = `giveplus ${player.steamId} ${listing.name} ${listing.amount} ${listing.quality ? listing.quality + " 0" : ''}`;
    } else {
      cmdToExec = `give ${player.entityId} ${listing.name} ${listing.amount} ${listing.quality ? listing.quality : ''}`;
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

      await ShopListing.update({
        id: listing.id
      }, {
        timesBought: listing.timesBought++
      });

      return chatMessage.reply(`You have bought ${listing.friendlyName} for ${listing.price} ${server.config.currencyName}`)
    } catch (error) {
      sails.log.warn(error);
      chatMessage.reply(`Something went wrong while trying to buy ${listing.friendlyName}. Please contact a server admin.`);
    }
  }

  async run(chatMessage, player, server, args) {
    const listings = await ShopListing.find({
      server: server.id
    });

    if (args.length === 0) {
        await chatMessage.reply(`To view items from page 1: '${server.config.commandPrefix}shop 1'`);
        await chatMessage.reply(`To buy item #4 from page 1: '${server.config.commandPrefix}shop buy 1 4'`);
        await chatMessage.reply(`Webshop: ${process.env.CSMM_HOSTNAME}/shop/${server.id}`);
    }

    if (args[0]) {
      if (args[0] === 'buy') {
        const page = parseInt(args[1]);
        const itemNumber = parseInt(args[2]);

        if (!_.isFinite(page) || !_.isFinite(itemNumber)) {
          return chatMessage.reply(`You have provided invalid arguments to buy an item. page: '${page}' item number: '${itemNumber}'`);
        }

        const startIndex = (page - 1) * 10;
        const listingsToShow = listings.slice(startIndex, startIndex + 10);
        const listing = listingsToShow[itemNumber - 1];

        if (_.isUndefined(listing)) {
          return chatMessage.reply(`No item found on page ${page} with number ${itemNumber}`);
        }

        await this._buyItem(listing, player, server, chatMessage);
      } else {
        const page = parseInt(args[0]);
        if (!_.isFinite(page)) {
          return chatMessage.reply(`You have provided an invalid shop page number. '${args[0]}'`);
        }
        const startIndex = (page - 1) * 10;
        const listingsToShow = listings.slice(startIndex, startIndex + 10);

        if (args[1]) {
          const itemNumber = parseInt(args[1]);
          if (!_.isFinite(itemNumber)) {
            return chatMessage.reply(`You have provided an invalid shop item number. '${args[1]}'`);
          }
          let listing = listingsToShow[itemNumber - 1];

          if (_.isUndefined(listing)) {
            return chatMessage.reply(`No item found on page ${page} with number ${itemNumber}`);
          }

          await chatMessage.reply(`${listing.friendlyName} costs ${listing.price} ${server.config.currencyName}`);
          await chatMessage.reply(`It consists of ${listing.amount}x ${listing.name} with quality ${listing.quality}`);
          return;
        }

        
        if (listingsToShow.length === 0) {
          return chatMessage.reply(`No items found on page ${page}!`);
        }

        let listingCounter = 1;
        for (const listing of listingsToShow) {
          await chatMessage.reply(`#${listingCounter}. ${listing.price} ${server.config.currencyName} ${listing.friendlyName}`);
          listingCounter++
        }
      }
    }
  }
}

module.exports = Shop;
