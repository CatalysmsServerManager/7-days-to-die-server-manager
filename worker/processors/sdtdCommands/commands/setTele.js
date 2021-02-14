let SdtdCommand = require('../command.js');
var validator = require('validator');

class setTele extends SdtdCommand {
  constructor() {
    super({
      name: 'settele',
      description: 'Create a teleport location',
      extendedDescription: 'Creates a teleport location at your current position. Arguments: name',
      aliases: ['teleset', 'telecreate']
    });
  }

  async isEnabled(chatMessage, player, server) {
    return server.config.enabledPlayerTeleports;
  }

  async run(chatMessage, player, server, args) {

    let playerTeleports = await PlayerTeleport.find({
      player: player.id
    });
    let playerRole = await sails.helpers.sdtd.getPlayerRole(player.id);

    let playersOnServer = await Player.find({
      server: server.id
    });
    let publicTeleports = await PlayerTeleport.find({
      player: playersOnServer.map(player => player.id),
      publicEnabled: true
    });

    if (args.length === 0) {
      return chatMessage.reply('setTeleMissingName');
    }

    if (args.length > 1) {
      return chatMessage.reply('setTeleTooManyArguments');
    }

    if (playerTeleports.length >= server.config.maxPlayerTeleportLocations) {
      return chatMessage.reply('setTeleTooManyTeleports');
    }

    if (playerTeleports.length >= playerRole.amountOfTeleports) {
      return chatMessage.reply(`setTeleTooManyTeleportsRole`, {
        playerRole: playerRole
      });
    }


    let teleportsToCheckForName = playerTeleports.concat(publicTeleports);
    // Remove duplicates
    teleportsToCheckForName = _.uniq(teleportsToCheckForName, 'id');


    let nameAlreadyInUse = false;
    teleportsToCheckForName.forEach(teleport => {
      if (teleport.name === args[0]) {
        nameAlreadyInUse = true;
      }
    });

    if (nameAlreadyInUse) {
      return chatMessage.reply(`setTeleNameInUse`);
    }

    if (!validator.isAlphanumeric(args[0])) {
      return chatMessage.reply(`OnlyAlfaNumeric`);
    }

    if (server.config.economyEnabled && server.config.costToSetTeleport) {
      let notEnoughMoney = false;

      try {
        await sails.helpers.economy.deductFromPlayer.with({
          playerId: player.id,
          amountToDeduct: server.config.costToSetTeleport,
          message: `COMMAND - ${this.name}`
        });
      } catch (error) {
        notEnoughMoney = true;
      }

      if (notEnoughMoney) {
        return chatMessage.reply(`notEnoughMoney`, {
          cost: server.config.costToSetTeleport
        });
      }
    }

    let createdTeleport = await PlayerTeleport.create({
      name: args[0],
      x: player.positionX,
      y: player.positionY,
      z: player.positionZ,
      player: player.id
    }).fetch();

    return chatMessage.reply(`setTeleSuccess`, {
      createdTeleport: createdTeleport
    });
  }
}

module.exports = setTele;
