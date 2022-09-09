const SdtdCommand = require('../command.js');

class removeTele extends SdtdCommand {
  constructor() {
    super({
      name: 'removetele',
      description: 'Remove a teleport location',
      extendedDescription: 'Delete a teleport location from the system',
      aliases: ['teleremove', 'telerm', 'teledelete', 'teledel',
	    'teleportremove', 'teleportrm', 'teleportdelete', 'teleportdel',
		'tpremove', 'tprm', 'tpdelete', 'tpdel',
		'removeteleport', 'removetp',
		'rmtele', 'rmteleport', 'rmtp',
		'deletetele', 'deleteteleport', 'deletetp',
		'deltele', 'delteleport', 'deltp']
    });
  }

  async isEnabled(chatMessage, player, server) {
    return server.config.enabledPlayerTeleports;
  }

  async run(chatMessage, player, server, args) {
    let playerTeleports = await PlayerTeleport.find({
      player: player.id
    });

    if (args.length === 0) {
      return chatMessage.reply(`removeTeleMissingTeleportName`);
    }

    if (args.length > 1) {
      return chatMessage.reply(`removeTeleTooManyArguments`);
    }

    let teleportFound = false;
    playerTeleports.forEach(teleport => {
      if (teleport.name === args[0]) {
        teleportFound = teleport;
      }
    });

    if (!teleportFound) {
      return chatMessage.reply(`removeTeleTeleportNotFound`);
    }

    await PlayerTeleport.destroy(teleportFound);
    return chatMessage.reply(`removeTeleSuccess`, {
      teleport: teleportFound
    });

  }
}

module.exports = removeTele;
