let SdtdCommand = require('../command.js');
const sevenDays = require('machinepack-7daystodiewebapi');

class telePublic extends SdtdCommand {
  constructor(serverId) {
    super(serverId, {
      name: 'telepublic',
      description: 'Make a teleport public',
      extendedDescription: 'Let everyone on the server teleport to a location',
      aliases: ['telepub', 'pubtele', 'publictele']
    });
    this.serverId = serverId;
  }

  async isEnabled(chatMessage, player, server, args) {
    return server.config.enabledPlayerTeleports;
  }

  async run(chatMessage, player, server, args) {

    let playerTeleports = await PlayerTeleport.find({
      player: player.id
    });
    let playersOnServer = await Player.find({
      server: server.id
    });
    let publicTeleports = await PlayerTeleport.find({
      player: playersOnServer.map(player => player.id),
      publicEnabled: true
    });

    let teleportsToCheckForName = publicTeleports;

    let nameAlreadyInUse = false;
    teleportsToCheckForName.forEach(teleport => {
      if (teleport.name == args[0]) {
        nameAlreadyInUse = true;
      }
    });

    if (nameAlreadyInUse) {
      return chatMessage.reply(`renameTeleNameInUse`);
    }

    if (playerTeleports.length == 0) {
      return chatMessage.reply(`NoTeleportFound`);
    }

    let teleportFound = false;
    playerTeleports.forEach(teleport => {
      if (teleport.name == args[0]) {
        teleportFound = teleport;
      }
    });

    if (!teleportFound) {
      return chatMessage.reply(`NoTeleportFound`);
    }

    if (server.config.economyEnabled && server.config.costToMakeTeleportPublic) {
      let notEnoughMoney = false;
      let result = await sails.helpers.economy.deductFromPlayer.with({
        playerId: player.id,
        amountToDeduct: server.config.costToMakeTeleportPublic,
        message: `COMMAND - ${this.name}`
      }).tolerate('notEnoughCurrency', totalNeeded => {
        notEnoughMoney = true;
      });
      if (notEnoughMoney) {
        return chatMessage.reply(`notEnoughMoney`, {
          cost: server.config.costToMakeTeleportPublic
        });
      }
    }

    await PlayerTeleport.update({
      id: teleportFound.id
    }, {
      publicEnabled: true
    });
    return chatMessage.reply(`telePublicSuccess`, {
      teleport: teleportFound
    });



  }
}

module.exports = telePublic;
