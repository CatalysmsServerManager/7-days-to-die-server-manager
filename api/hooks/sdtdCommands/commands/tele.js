let SdtdCommand = require('../command.js');
const sevenDays = require('machinepack-7daystodiewebapi');

class tele extends SdtdCommand {
  constructor(serverId) {
    super(serverId, {
      name: 'tele',
      description: 'Teleport to a set location.',
      extendedDescription: "Provide the name of where you want to go",
      aliases: ["tp", "teleport"]
    });
    this.serverId = serverId;
  }

  async isEnabled(chatMessage, player, server, args) {
    return server.config.enabledPlayerTeleports
  }

  async run(chatMessage, player, server, args) {
    let publicTeleports = new Array();

    let publicTelesByPlayer = await PlayerTeleport.find({
      player: server.players.map(player => player.id),
      publicEnabled: true
    });
    publicTeleports = publicTeleports.concat(publicTelesByPlayer);


    let playerTeleports = await PlayerTeleport.find({
      player: player.id
    });

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
      return chatMessage.reply(`NoTeleportFound`)
    }

    let currentTime = new Date();
    let lastTeleportTime = new Date(player.lastTeleportTime)
    if (((currentTime - lastTeleportTime) / 1000) < server.config.playerTeleportTimeout) {
      let secondsToWait = Math.floor(server.config.playerTeleportTimeout - ((currentTime - lastTeleportTime) / 1000));
      return chatMessage.reply(`teleCooldown`, {
        secondsToWait: secondsToWait
      })
    }

    if (server.config.playerTeleportDelay) {
      chatMessage.reply(`teleDelay`);
    }

    if (server.config.economyEnabled && server.config.costToTeleport) {
      let playerBalance = await sails.helpers.economy.getPlayerBalance(player.id);

      if (playerBalance < server.config.costToTeleport) {
        return chatMessage.reply(`notEnoughMoney`, {
          cost: server.config.costToTeleport
        })
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
          chatMessage.reply(`teleSuccess`, {
            teleport: teleportFound
          });
          await Player.update({
            id: player.id
          }, {
            lastTeleportTime: new Date()
          })
          await PlayerTeleport.update({
            id: teleportFound.id
          }, {
            timesUsed: teleportFound.timesUsed + 1
          });
          if (server.config.economyEnabled && server.config.costToTeleport) {
            await sails.helpers.economy.deductFromPlayer.with({
              playerId: player.id,
              amountToDeduct: server.config.costToTeleport,
              message: `COMMAND - ${this.name}`
            });
          }
          return;
        },
        error: (error) => {
          sails.log.warn(`Hook - sdtdCommands:teleport - ${error}`);
          sails.log.error(error)
          chatMessage.reply(`error`);
        }
      });
    }, server.config.playerTeleportDelay * 1000)



  }
}

module.exports = tele;
