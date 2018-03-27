let SdtdCommand = require('../command.js');
const sevenDays = require('machinepack-7daystodiewebapi');

class tele extends SdtdCommand {
  constructor(serverId) {
    super(serverId, {
      name: 'tele',
    });
    this.serverId = serverId;
  }

  async run(chatMessage, playerId) {

    let server = await SdtdServer.findOne({
      id: this.serverId
    }).populate('config');
    let player = await Player.findOne({
      id: playerId
    });
    let playerTeleports = await PlayerTeleport.find({ player: playerId });

    let args = chatMessage.messageText.split(' ');
    args.splice(0, 1)


    if (!server.config[0].enabledPlayerTeleports) {
      return sevenDays.sendMessage({
        ip: server.ip,
        port: server.webPort,
        authName: server.authName,
        authToken: server.authToken,
        message: `This command is disabled! Ask your server admin to enable this.`,
        playerId: player.steamId
      }).exec({
        error: (error) => {
          sails.log.error(`HOOK - SdtdCommands - Failed to respond to player`);
        },
        success: (result) => {
          return;
        }
      });
    }

    let teleportFound = false
    playerTeleports.forEach(teleport => {
      if (teleport.name == args[0]) {
        teleportFound = teleport
      }
    })

    if (!teleportFound) {
      return sevenDays.sendMessage({
        ip: server.ip,
        port: server.webPort,
        authName: server.authName,
        authToken: server.authToken,
        message: `No teleport with that name found`,
        playerId: player.steamId
      }).exec({
        error: (error) => {
          sails.log.error(`HOOK - SdtdCommands - Failed to respond to player`);
        },
        success: (result) => {
          return;
        }
      });
    }

    let currentTime = new Date();
    let lastTeleportTime = new Date(player.lastTeleportTime)
    if (((currentTime - lastTeleportTime)/1000) < server.config[0].playerTeleportTimeout) {
      let secondsToWait = Math.floor(server.config[0].playerTeleportTimeout - ((currentTime - lastTeleportTime)/1000));
      return sevenDays.sendMessage({
        ip: server.ip,
        port: server.webPort,
        authName: server.authName,
        authToken: server.authToken,
        message: `You need to wait ${secondsToWait} seconds to teleport again!`,
        playerId: player.steamId
      }).exec({
        error: (error) => {
          sails.log.error(`HOOK - SdtdCommands - Failed to respond to player`);
        },
        success: (result) => {
          return;
        }
      });
    }

    sevenDays.teleportPlayer({
      ip: server.ip,
      port: server.webPort,
      authName: server.authName,
      authToken: server.authToken,
      playerId: player.steamId,
      coordinates: `${teleportFound.x} ${teleportFound.y} ${teleportFound.z}`
    }).exec({
      success: (response) => {
        return sevenDays.sendMessage({
          ip: server.ip,
          port: server.webPort,
          authName: server.authName,
          authToken: server.authToken,
          message: `Woosh! Welcome to ${teleportFound.name}`,
          playerId: player.steamId
        }).exec({
          error: (error) => {
            sails.log.error(`HOOK - SdtdCommands - Failed to respond to player`);
          },
          success: async (result) => {
            await Player.update({id: player.id}, {lastTeleportTime: new Date()})
            return;
          }
        });
      },
      error: (error) => {
        sails.log.error(`Hook - sdtdCommands:teleport - ${error}`);
        return exits.error(error);
      }
    });

  }
}

module.exports = tele;
