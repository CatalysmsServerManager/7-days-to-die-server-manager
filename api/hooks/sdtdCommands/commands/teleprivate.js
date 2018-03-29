let SdtdCommand = require('../command.js');
const sevenDays = require('machinepack-7daystodiewebapi');

class telePrivate extends SdtdCommand {
    constructor(serverId) {
        super(serverId, {
            name: 'teleprivate',
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

        if (playerTeleports.length == 0) {
            return sevenDays.sendMessage({
                ip: server.ip,
                port: server.webPort,
                authName: server.authName,
                authToken: server.authToken,
                message: `Found no teleport location for you!`,
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

          await PlayerTeleport.update({id: teleportFound.id}, {public: false});
          return sevenDays.sendMessage({
            ip: server.ip,
            port: server.webPort,
            authName: server.authName,
            authToken: server.authToken,
            message: `Your teleport ${teleportFound.name} has been set as private.`,
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

module.exports = telePrivate;
