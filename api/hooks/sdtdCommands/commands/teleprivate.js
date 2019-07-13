let SdtdCommand = require('../command.js');
const sevenDays = require('machinepack-7daystodiewebapi');

class telePrivate extends SdtdCommand {
  constructor(serverId) {
    super(serverId, {
      name: 'teleprivate',
      description: "Make a teleport private",
      extendedDescription: "When a teleport is private, only you can use it.",
      aliases: ["privatetele", "privtele", "telepriv"]
    });
    this.serverId = serverId;
  }

  async isEnabled(chatMessage, player, server, args) {
    return server.config.enabledPlayerTeleports
  }

  async run(chatMessage, player, server, args) {

    let playerTeleports = await PlayerTeleport.find({
      player: player.id
    });

    if (playerTeleports.length == 0) {
      return chatMessage.reply(`NoTeleportFound`)
    }

    let teleportFound = false
    playerTeleports.forEach(teleport => {
      if (teleport.name == args[0]) {
        teleportFound = teleport
      }
    })

    if (!teleportFound) {
      return chatMessage.reply(`NoTeleportFound`)
    }

    await PlayerTeleport.update({
      id: teleportFound.id
    }, {
      publicEnabled: false
    });
    return chatMessage.reply(`telePrivateSuccess`, {
      teleport: teleportFound
    })



  }
}

module.exports = telePrivate;
