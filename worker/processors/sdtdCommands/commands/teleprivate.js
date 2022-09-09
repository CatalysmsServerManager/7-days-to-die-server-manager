const SdtdCommand = require('../command.js');

class telePrivate extends SdtdCommand {
  constructor() {
    super( {
      name: 'teleprivate',
      description: 'Make a teleport private',
      extendedDescription: 'When a teleport is private, only you can use it.',
      aliases: ['telepriv',
        'teleportprivate', 'teleportpriv',
        'tpprivate', 'tppriv',
        'privatetele', 'privateteleport', 'privatetp',
        'privtele', 'privteleport', 'privtp']
    });
  }

  async isEnabled(chatMessage, player, server) {
    return server.config.enabledPlayerTeleports;
  }

  async run(chatMessage, player, server, args) {

    let playerTeleports = await PlayerTeleport.find({
      player: player.id
    });

    if (playerTeleports.length === 0) {
      return chatMessage.reply(`NoTeleportFound`);
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

    await PlayerTeleport.update({
      id: teleportFound.id
    }, {
      publicEnabled: false
    });
    return chatMessage.reply(`telePrivateSuccess`, {
      teleport: teleportFound
    });



  }
}

module.exports = telePrivate;
