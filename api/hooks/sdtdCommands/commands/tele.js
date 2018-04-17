let SdtdCommand = require('../command.js');
const sevenDays = require('machinepack-7daystodiewebapi');

class tele extends SdtdCommand {
  constructor(serverId) {
    super(serverId, {
      name: 'tele',
    });
    this.serverId = serverId;
  }

  async run(chatMessage, player, server, args) {
    let publicTeleports = new Array();

    for (const player of server.players) {
      let publicTelesByPlayer = await PlayerTeleport.find({ player: player.id, public: true });
      publicTeleports = publicTeleports.concat(publicTelesByPlayer);
    }

    let playerTeleports = await PlayerTeleport.find({ player: player.id });

    let serverTeleportsFound = playerTeleports.concat(publicTeleports);
    // Remove duplicates
    serverTeleportsFound = _.uniq(serverTeleportsFound, 'id');

    if (!server.config.enabledPlayerTeleports) {
      return chatMessage.reply('Command disabled - ask your server owner to enable this!');
    }

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
      let secondsToWait = Math.floor(server.config[0].playerTeleportTimeout - ((currentTime - lastTeleportTime) / 1000));
      return chatMessage.reply(`You need to wait ${secondsToWait} seconds to teleport again!`)
    }

    if (server.config.playerTeleportDelay) {
      chatMessage.reply(`You will be teleported in ${server.config.playerTeleportDelay} seconds`);
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
          sails.log.error(`Hook - sdtdCommands:teleport - ${error}`);
          return exits.error(error);
        }
      });
    }, server.config.playerTeleportDelay * 1000)



  }
}

module.exports = tele;
