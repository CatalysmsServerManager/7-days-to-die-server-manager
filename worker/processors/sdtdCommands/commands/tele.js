const SdtdCommand = require('../command.js');
const wait = require('../../../util/wait').wait;

class tele extends SdtdCommand {
  constructor() {
    super({
      name: 'tele',
      description: 'Teleport to a set location.',
      extendedDescription: 'Provide the name of where you want to go',
      aliases: ['tp', 'teleport']
    });
  }

  async isEnabled(chatMessage, player, server) {
    return server.config.enabledPlayerTeleports;
  }

  async run(chatMessage, player, server, args) {
    let publicTeleports = new Array();
    const playerIds = await Player.find({ where: { server: server.id }, select: ['id'] });
    let publicTelesByPlayer = await PlayerTeleport.find({
      player: playerIds.map(_ => _.id),
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

    if (server.config.economyEnabled && server.config.costToTeleport) {
      let playerBalance = await sails.helpers.economy.getPlayerBalance(player.id);

      if (playerBalance < server.config.costToTeleport) {
        return chatMessage.reply(`notEnoughMoney`, {
          cost: server.config.costToTeleport
        });
      }
    }

    if (server.config.playerTeleportDelay) {
      await chatMessage.reply(`teleDelay`);
      await wait(server.config.playerTeleportDelay);
    }

    await sails.helpers.sdtdApi.executeConsoleCommand(
      SdtdServer.getAPIConfig(server),
      `tele ${player.entityId} ${teleportFound.x} ${teleportFound.y} ${teleportFound.z}`
    );

    await chatMessage.reply(`teleSuccess`, {
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
  }
}

module.exports = tele;
