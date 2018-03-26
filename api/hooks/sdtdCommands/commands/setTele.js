let SdtdCommand = require('../command.js');
const sevenDays = require('machinepack-7daystodiewebapi');

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
    let args = chatMessage.messageText.split(' ');
    args.splice(0,1)


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

    let playerData = await sails.helpers.loadPlayerData(server.id, player.steamId);
    let location = playerData.players[0].location

    let locationObj = {
      name: args[0],
      x: location.x,
      y: location.y,
      z: location.z
    }

    console.log(locationObj)
    


  }
}

module.exports = setTele;
