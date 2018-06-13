let SdtdCommand = require('../command.js');
const sevenDays = require('machinepack-7daystodiewebapi');

class listTele extends SdtdCommand {
    constructor(serverId) {
        super(serverId, {
            name: 'listtele',
        });
        this.serverId = serverId;
    }

    async isEnabled(chatMessage, player, server, args) {
        return server.config.enabledPlayerTeleports
      }

    async run(chatMessage, player, server, args) {

        let playerTeleports = await loadTeleports()

        async function loadTeleports() {
            let playerTeleports = new Array();
            if (args[0] == 'public') {
                for (const player of server.players) {
                    let publicTelesByPlayer = await PlayerTeleport.find({ player: player.id, publicEnabled: true });
                    playerTeleports = playerTeleports.concat(publicTelesByPlayer);
                }
                playerTeleports = _.uniq(playerTeleports, 'id');
                return playerTeleports;
            } else {
                playerTeleports = await PlayerTeleport.find({ player: player.id });
                return playerTeleports;
            }
        }

        if (args.length > 1) {
            return chatMessage.reply(`Too many arguments! You can only provide a 'public' argumant.`)
        }

        if (playerTeleports.length == 0) {
            return chatMessage.reply(`Found no teleport location for you!`)
        }

        let stringToSend = new String(`Found ${playerTeleports.length} ${playerTeleports.length > 1 ? 'teleports' : 'teleport'}: `);
        playerTeleports.forEach(teleport => {
            stringToSend += `${teleport.publicEnabled ? 'PUBLIC' : 'PRIVATE'}- ${teleport.name} at ${teleport.x},${teleport.y},${teleport.z}`;
        })

        return chatMessage.reply(stringToSend)
    }
}

module.exports = listTele;
