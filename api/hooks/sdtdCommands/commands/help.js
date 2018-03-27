let SdtdCommand = require('../command.js');
const sevenDays = require('machinepack-7daystodiewebapi');

class help extends SdtdCommand {
    constructor(serverId) {
        super(serverId, {
            name: 'help',
        });
        this.serverId = serverId;
    }

    async run(chatMessage, playerId) {

        let player = await Player.findOne({
            id: playerId
        });
        let server = await SdtdServer.findOne({
            id: this.serverId
          })

        return sevenDays.sendMessage({
            ip: server.ip,
            port: server.webPort,
            authName: server.authName,
            authToken: server.authToken,
            message: `RTFM! :D - http://csmm.readthedocs.io/en/latest/for-players.html`,
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

module.exports = help;
