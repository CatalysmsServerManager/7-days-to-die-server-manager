const SdtdCommand = require('../command.js');
const SdtdApi = require('7daystodie-api-wrapper');

class Shop extends SdtdCommand {
  constructor() {
    super({
      name: 'shop',
      description: 'Ingame shop',
      extendedDescription: '',
      aliases: ['store']
    });
  }

  async isEnabled(chatMessage, player, server) {
    return server.config.economyEnabled;
  }

  async _buyItem(listing, player, server, chatMessage) {
    const cpmVersion = await sails.helpers.sdtd.checkCpmVersion(server.id);
    let cmdToExec;


    if (player.currency < listing.price) {
      return chatMessage.reply(`notEnoughMoney`, {
        cost: listing.price
      });
    }

    await sails.helpers.economy.deductFromPlayer(player.id, listing.price, `SHOP - INGAME - bought ${listing.name}`);


    if (cpmVersion >= 6.4) {
      cmdToExec = `giveplus ${player.entityId} "${listing.name}" ${listing.amount} ${listing.quality ? listing.quality + ' 0' : ''}`;
    } else {
      cmdToExec = `give ${player.entityId} "${listing.name}" ${listing.amount} ${listing.quality ? listing.quality : ''}`;
    }

    try {
      let response = await SdtdApi.executeConsoleCommand({
        ip: server.ip,
        port: server.webPort,
        adminUser: server.authName,
        adminToken: server.authToken
      }, cmdToExec);

      if (response.result.includes('ERR:')) {
        return chatMessage.reply(`error`);
      }

      await ShopListing.update({
        id: listing.id
      }, {
        timesBought: listing.timesBought++
      });

      return chatMessage.reply(`shopSuccess`, { listing });
    } catch (error) {
      sails.log.warn(error, {server, player});
      chatMessage.reply(`error`);
    }
  }

  async run(chatMessage, player, server, args) {
    const listings = await ShopListing.find({
      server: server.id
    });

    if (args.length === 0) {
      await chatMessage.reply(`shopViewHelp`);
      await chatMessage.reply(`shopBuyHelp`);
      await chatMessage.reply(`${process.env.CSMM_HOSTNAME}/shop/${server.id}`);
    }

    if (args[0]) {
      if (args[0] === 'buy') {
        const page = parseInt(args[1]);
        const itemNumber = parseInt(args[2]);

        if (!_.isFinite(page) || !_.isFinite(itemNumber)) {
          return chatMessage.reply(`shopInvalidArgs`);
        }

        const startIndex = (page - 1) * 10;
        const listingsToShow = listings.slice(startIndex, startIndex + 10);
        const listing = listingsToShow[itemNumber - 1];

        if (_.isUndefined(listing)) {
          return chatMessage.reply(`shopNoItemsFound`);
        }

        await this._buyItem(listing, player, server, chatMessage);
      } else {
        const page = parseInt(args[0]);
        if (!_.isFinite(page)) {
          return chatMessage.reply(`shopInvalidArgs`);
        }
        const startIndex = (page - 1) * 10;
        const listingsToShow = listings.slice(startIndex, startIndex + 10);

        if (args[1]) {
          const itemNumber = parseInt(args[1]);
          if (!_.isFinite(itemNumber)) {
            return chatMessage.reply(`shopInvalidArgs`);
          }
          let listing = listingsToShow[itemNumber - 1];

          if (_.isUndefined(listing)) {
            return chatMessage.reply(`shopNoItemsFound`);
          }

          await chatMessage.reply(`shopItemInfo`, {
            listing: listing
          });
          return;
        }


        if (listingsToShow.length === 0) {
          return chatMessage.reply(`shopNoItemsFound`);
        }

        let listingCounter = 1;
        for (const listing of listingsToShow) {
          await chatMessage.reply(`#${listingCounter}. ${listing.price} ${server.config.currencyName} ${listing.friendlyName}`);
          listingCounter++;
        }
      }
    }
  }
}

module.exports = Shop;
