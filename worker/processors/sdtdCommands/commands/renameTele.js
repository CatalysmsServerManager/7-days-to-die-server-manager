const SdtdCommand = require('../command.js');
var validator = require('validator');

class renameTele extends SdtdCommand {
  constructor() {
    super({
      name: 'renametele',
      description: 'Rename a teleport location',
      extendedDescription: 'Arguments: oldname newname',
      aliases: ['telerename', 'telern',
        'teleportrename', 'teleportrn',
        'tprename', 'tprn',
        'renameteleport', 'renametp',
        'rntele', 'rnteleport', 'rntp']
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
      return chatMessage.reply('renameTeleMissingArgument');
    }

    if (args.length > 2) {
      return chatMessage.reply(`renameTeleTooManyArguments`);
    }

    let teleportFound = false;
    playerTeleports.forEach(teleport => {
      if (teleport.name === args[0]) {
        teleportFound = teleport;
      }
    });

    if (!teleportFound) {
      return chatMessage.reply(`NoTeleportFound`);
    }

    let nameAlreadyInUse = false;
    playerTeleports.forEach(teleport => {
      if (teleport.name === args[1]) {
        nameAlreadyInUse = true;
      }
    });

    if (nameAlreadyInUse) {
      return chatMessage.reply(`renameTeleNameInUse`);
    }

    if (!validator.isAlphanumeric(args[1])) {
      return chatMessage.reply(`OnlyAlfaNumeric`);
    }

    await PlayerTeleport.update({
      id: teleportFound.id
    }, {
      name: args[1]
    });

    return chatMessage.reply(`renameTeleSuccess`, {
      oldName: teleportFound.name,
      newName: args[1]
    });
  }
}

module.exports = renameTele;
