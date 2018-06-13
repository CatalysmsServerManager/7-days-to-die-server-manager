let SdtdCommand = require('../command.js');
const sevenDays = require('machinepack-7daystodiewebapi');

class tele extends SdtdCommand {
  constructor(serverId) {
    super(serverId, {
      name: 'tele',
      description: 'Teleport to a set location.'
    });
    this.serverId = serverId;
  }

  async isEnabled(chatMessage, player, server, args) {
    return server.config.enabledPlayerTeleports
  }

  async run(chatMessage, player, server, args) {
    let publicTeleports = new Array();

    let publicTelesByPlayer = await PlayerTeleport.find({ player: server.players.map(player => player.id), publicEnabled: true });
    publicTeleports = publicTeleports.concat(publicTelesByPlayer);


    let playerTeleports = await PlayerTeleport.find({ player: player.id });

    let serverTeleportsFound = playerTeleports.concat(publicTeleports);
    // Remove duplicates
    serverTeleportsFound = _.uniq(serverTeleportsFound, 'id');

    let teleportFound = false
    serverTeleportsFound.forEach(teleport => {
      if (teleport.name == args[0]) {
        teleportFound = teleport
      }
    })

    if (!teleportFound) {
      return chatMessage.reply(`No teleport with that name found`)
    }

    let currentTime = new Date();
    let lastTeleportTime = new Date(player.lastTeleportTime)
    if (((currentTime - lastTeleportTime) / 1000) < server.config.playerTeleportTimeout) {
      let secondsToWait = Math.floor(server.config.playerTeleportTimeout - ((currentTime - lastTeleportTime) / 1000));
      return chatMessage.reply(`You need to wait ${secondsToWait} seconds to teleport again!`)
    }

    if (server.config.playerTeleportDelay) {
      chatMessage.reply(`You will be teleported in ${server.config.playerTeleportDelay} seconds`);
    }

    if (server.config.economyEnabled && server.config.costToTeleport) {
      let notEnoughMoney = false
      let result = await sails.helpers.economy.deductFromPlayer.with({
        playerId: player.id,
        amountToDeduct: server.config.costToTeleport,
        message: `COMMAND - ${this.name}`
      }).tolerate('notEnoughCurrency', totalNeeded => {
        notEnoughMoney = true;
      })
      if (notEnoughMoney) {
        return chatMessage.reply(`You do not have enough money to do that! This action costs ${server.config.costToTeleport} ${server.config.currencyName}`)
      }
    }

    setTimeout(function () {
      sevenDays.teleportPlayer({
        ip: server.ip,
        port: server.webPort,
        authName: server.authName,
        authToken: server.authToken,
        playerId: player.steamId,
        coordinates: `${teleportFound.x} ${teleportFound.y} ${teleportFound.z}`
      }).exec({
        success: async (response) => {
          chatMessage.reply(`Woosh! Welcome to ${teleportFound.name}`);
          await Player.update({ id: player.id }, { lastTeleportTime: new Date() })
          await PlayerTeleport.update({ id: teleportFound.id }, { timesUsed: teleportFound.timesUsed + 1 });
          return;
        },
        error: (error) => {
          sails.log.warn(`Hook - sdtdCommands:teleport - ${error}`);
          sails.log.error(error)
        }
      });
    }, server.config.playerTeleportDelay * 1000)



  }
}

module.exports = tele;
