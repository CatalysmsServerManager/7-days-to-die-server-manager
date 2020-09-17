const SdtdCommand = require('../command.js');

class tele extends SdtdCommand {
  constructor(serverId) {
    super(serverId, {
      name: 'tele',
      description: 'Teleport to a set location.',
      extendedDescription: 'Provide the name of where you want to go',
      aliases: ['tp', 'teleport']
    });
    this.serverId = serverId;
  }

  async isEnabled(chatMessage, player, server) {
    return server.config.enabledPlayerTeleports;
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

    let teleportFound = serverTeleportsFound.find(element => element.name === args[0]);

    if (!teleportFound) {
      return chatMessage.reply(`NoTeleportFound`);
    }

    let currentTime = new Date();
    let lastTeleportTime = new Date(player.lastTeleportTime);
    if (((currentTime - lastTeleportTime) / 1000) < server.config.playerTeleportTimeout) {
      let secondsToWait = Math.floor(server.config.playerTeleportTimeout - ((currentTime - lastTeleportTime) / 1000));
      return chatMessage.reply(`teleCooldown`, {
        secondsToWait: secondsToWait
      });
    }

    if (server.config.playerTeleportDelay) {
      chatMessage.reply(`teleDelay`);
    }

    if (server.config.economyEnabled && server.config.costToTeleport) {
      let playerBalance = await sails.helpers.economy.getPlayerBalance(player.id);

      if (playerBalance < server.config.costToTeleport) {
        return chatMessage.reply(`notEnoughMoney`, {
          cost: server.config.costToTeleport
        });
      }
    }

    return new Promise((resolve, reject) => {
      setTimeout(async function () {
        try {
          await sails.helpers.sdtdApi.executeConsoleCommand(
            SdtdServer.getAPIConfig(server),
            `tele ${player.steamId} ${teleportFound.x} ${teleportFound.y} ${teleportFound.z}`
          );

        } catch (error) {
          sails.log.warn(`Hook - sdtdCommands:teleport - ${error}`);
          sails.log.error(error);
          await chatMessage.reply(`error`);
          return reject(error);
        }

        chatMessage.reply(`teleSuccess`, {
          teleport: teleportFound
        });

        await Player.update({
          id: player.id
        }, {
          lastTeleportTime: new Date()
        });
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

        return resolve();
      }, server.config.playerTeleportDelay * 1000);
    });


  }

}

module.exports = tele;
