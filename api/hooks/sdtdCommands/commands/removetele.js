let SdtdCommand = require('../command.js');
const sevenDays = require('machinepack-7daystodiewebapi');

class removeTele extends SdtdCommand {
  constructor(serverId) {
    super(serverId, {
      name: 'removetele',
      description: "Remove a teleport location",
      extendedDescription: "Delete a teleport location from the system",
      aliases: ["deltele", "teledelete", "deletetele", "teleremove"]
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

    if (args.length == 0) {
      return chatMessage.reply(`removeTeleMissingTeleportName`)
    }

    if (args.length > 1) {
      return chatMessage.reply(`removeTeleTooManyArguments`)
    }

    let teleportFound = false
    playerTeleports.forEach(teleport => {
      if (teleport.name == args[0]) {
        teleportFound = teleport
      }
    })

    if (!teleportFound) {
      return chatMessage.reply(`removeTeleTeleportNotFound`)
    }

    await PlayerTeleport.destroy(teleportFound);
    return chatMessage.reply(`removeTeleSuccess`, {
      teleport: teleportFound
    })

  }
}

module.exports = removeTele;
