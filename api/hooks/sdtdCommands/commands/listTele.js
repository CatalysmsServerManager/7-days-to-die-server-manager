let SdtdCommand = require('../command.js');
const sevenDays = require('machinepack-7daystodiewebapi');

class listTele extends SdtdCommand {
    constructor(serverId) {
        super(serverId, {
            name: 'listtele',
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

        let stringToSend = new String(`Found ${playerTeleports.length} ${playerTeleports.length > 1 ? 'teleports' : 'teleport'}: `);
        playerTeleports.forEach(teleport => {
            stringToSend += `${teleport.public ? 'PUBLIC' : 'PRIVATE'}- ${teleport.name} at ${teleport.x},${teleport.y},${teleport.z}`;
        })

        return sevenDays.sendMessage({
            ip: server.ip,
            port: server.webPort,
            authName: server.authName,
            authToken: server.authToken,
            message: stringToSend,
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

module.exports = listTele;
