let SdtdCommand = require('../command.js');
const sevenDays = require('7daystodie-api-wrapper');

class listTele extends SdtdCommand {
  constructor(serverId) {
    super(serverId, {
      name: 'listtele',
      description: "List teleport locations",
      extendedDescription: "Lists your teleport locations. By providing a 'public' argument, you will instead see a list of public teleports",
      aliases: ["telelist", "teleslist", "listteles"]
    });
    this.serverId = serverId;
  }

  async isEnabled(chatMessage, player, server, args) {
    return server.config.enabledPlayerTeleports
  }

  async run(chatMessage, player, server, args) {

    async function loadTeleports() {
      let playerTeleports = new Array();
      if (args[0] == 'public') {
        for (const player of server.players) {
          let publicTelesByPlayer = await PlayerTeleport.find({
            player: player.id,
            publicEnabled: true
          });
          playerTeleports = playerTeleports.concat(publicTelesByPlayer);
        }
        playerTeleports = _.uniq(playerTeleports, 'id');
        return playerTeleports;
      } else {
        playerTeleports = await PlayerTeleport.find({
          player: player.id
        });
        return playerTeleports;
      }
    }

    let playerTeleports = await loadTeleports()


    if (args.length > 1) {
      return chatMessage.reply("listTeleTooManyArguments")
    }

    if (playerTeleports.length == 0) {
      return chatMessage.reply("listTeleNoTeleportsFound")
    }

    chatMessage.reply("listTeleResponse", {
      totalTeleports: playerTeleports.length
    })
    let stringToSend = new String();
    playerTeleports.forEach(teleport => {
      stringToSend += `${teleport.publicEnabled ? 'PUBLIC' : 'PRIVATE'}- ${teleport.name} at ${teleport.x},${teleport.y},${teleport.z}`;
    })

    return chatMessage.reply(stringToSend)
  }
}

module.exports = listTele;
