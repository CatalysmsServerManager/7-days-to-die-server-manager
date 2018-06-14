let SdtdCommand = require('../command.js');
const sevenDays = require('machinepack-7daystodiewebapi');
var validator = require('validator');

class setTele extends SdtdCommand {
  constructor(serverId) {
    super(serverId, {
      name: 'settele',
      description: "Create a teleport location",
      extendedDescription: "Creates a teleport location at your current position. Arguments: name",
      aliases: ["teleset", "telecreate"]
    });
    this.serverId = serverId;
  }

  async isEnabled(chatMessage, player, server, args) {
    return server.config.enabledPlayerTeleports
  }

  async run(chatMessage, player, server, args) {

    let playerTeleports = await PlayerTeleport.find({ player: player.id });

    let playersOnServer = await Player.find({ server: server.id });
    let publicTeleports = await PlayerTeleport.find({
      player: playersOnServer.map(player => player.id),
    });

    if (args.length == 0) {
      return chatMessage.reply('Please provide a name for your teleport');
    }

    if (args.length > 1) {
      return chatMessage.reply('Too many arguments, please provide a name only.');
    }

    if (playerTeleports.length >= server.config.maxPlayerTeleportLocations) {
      return chatMessage.reply("You've set too many locations already, remove one before adding any more");

    }


    let teleportsToCheckForName = playerTeleports.concat(publicTeleports);
    // Remove duplicates
    teleportsToCheckForName = _.uniq(teleportsToCheckForName, 'id');


    let nameAlreadyInUse = false
    teleportsToCheckForName.forEach(teleport => {
      if (teleport.name == args[0]) {
        nameAlreadyInUse = true
      }
    })

    if (nameAlreadyInUse) {
      return chatMessage.reply(`That name is already in use! Pick another one please.`);
    }

    if (!validator.isAlphanumeric(args[0])) {
      return chatMessage.reply(`Only alphanumeric values are allowed for teleport names.`);
    }

    if (server.config.economyEnabled && server.config.costToSetTeleport) {
      let notEnoughMoney = false
      await sails.helpers.economy.deductFromPlayer.with({
        playerId: player.id,
        amountToDeduct: server.config.costToSetTeleport,
        message: `COMMAND - ${this.name}`
      }).tolerate('notEnoughCurrency', totalNeeded => {
        notEnoughMoney = true;
      })
      if (notEnoughMoney) {
        return chatMessage.reply(`You do not have enough money to do that! This action costs ${server.config.costToSetTeleport} ${server.config.currencyName}`)
      }
    }

    let createdTeleport = await PlayerTeleport.create({
      name: args[0],
      x: player.positionX,
      y: player.positionY,
      z: player.positionZ,
      player: player.id
    }).fetch();

    return chatMessage.reply(`Your teleport ${createdTeleport.name} has been made! (${createdTeleport.x},${createdTeleport.y},${createdTeleport.z})`);
  }
}

module.exports = setTele;
