let SdtdCommand = require('../command.js');
const sevenDays = require('machinepack-7daystodiewebapi');
var validator = require('validator');

class setTele extends SdtdCommand {
  constructor(serverId) {
    super(serverId, {
      name: 'settele',
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
    let publicTeleports = await PlayerTeleport.find({ public: true });

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

    if (args.length == 0) {
      return sevenDays.sendMessage({
        ip: server.ip,
        port: server.webPort,
        authName: server.authName,
        authToken: server.authToken,
        message: `Please provide a name for your teleport.`,
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

    if (args.length > 1) {
      return sevenDays.sendMessage({
        ip: server.ip,
        port: server.webPort,
        authName: server.authName,
        authToken: server.authToken,
        message: `Too many arguments! Just provide a name please.`,
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

    if (playerTeleports.length >= server.config[0].maxPlayerTeleportLocations) {
      return sevenDays.sendMessage({
        ip: server.ip,
        port: server.webPort,
        authName: server.authName,
        authToken: server.authToken,
        message: `You've set too many locations already, remove one before adding any more`,
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

    if (!validator.isAlphanumeric(args[0])) {
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

    let playerData = await sails.helpers.loadPlayerData(server.id, player.steamId);
    let location = playerData.players[0].location

    let createdTeleport = await PlayerTeleport.create({
      name: args[0],
      x: location.x,
      y: location.y,
      z: location.z,
      player: playerId
    }).fetch();

    return sevenDays.sendMessage({
      ip: server.ip,
      port: server.webPort,
      authName: server.authName,
      authToken: server.authToken,
      message: `Your teleport ${createdTeleport.name} has been made! (${createdTeleport.x},${createdTeleport.y},${createdTeleport.z})`,
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

module.exports = setTele;
