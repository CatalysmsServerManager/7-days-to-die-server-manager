let SdtdCommand = require('../command.js');
const sevenDays = require('machinepack-7daystodiewebapi');
var validator = require('validator');

class renameTele extends SdtdCommand {
  constructor(serverId) {
    super(serverId, {
      name: 'renametele',
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

    if (args.length < 2) {
      return sevenDays.sendMessage({
        ip: server.ip,
        port: server.webPort,
        authName: server.authName,
        authToken: server.authToken,
        message: `Please provide a name for your teleport and a new name.`,
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

    if (args.length > 2) {
      return sevenDays.sendMessage({
        ip: server.ip,
        port: server.webPort,
        authName: server.authName,
        authToken: server.authToken,
        message: `Too many arguments! Just provide a teleport name and new name please.`,
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


    let nameAlreadyInUse = false
    playerTeleports.forEach(teleport => {
      if (teleport.name == args[1]) {
        nameAlreadyInUse = true
      }
    })

    if (nameAlreadyInUse) {
      return sevenDays.sendMessage({
        ip: server.ip,
        port: server.webPort,
        authName: server.authName,
        authToken: server.authToken,
        message: `That name is already in use! Pick another one please.`,
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

    if (!validator.isAlphanumeric(args[1])) {
      return sevenDays.sendMessage({
        ip: server.ip,
        port: server.webPort,
        authName: server.authName,
        authToken: server.authToken,
        message: `Only alphanumeric values are allowed for teleport names.`,
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

    await PlayerTeleport.update({id: teleportFound.id}, {name: args[1]});

    return sevenDays.sendMessage({
      ip: server.ip,
      port: server.webPort,
      authName: server.authName,
      authToken: server.authToken,
      message: `Your teleport ${teleportFound.name} was renamed to ${args[1]}`,
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
}

module.exports = renameTele;
