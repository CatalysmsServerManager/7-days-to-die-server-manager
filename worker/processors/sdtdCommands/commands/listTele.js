const SdtdCommand = require('../command.js');

class listTele extends SdtdCommand {
  constructor() {
    super({
      name: 'listtele',
      description: 'List teleport locations',
      extendedDescription: 'Lists your teleport locations. By providing a \'public\' argument, you will instead see a list of public teleports "$listtele public"',
      aliases: ['telelist', 'telels',
	    'teleportlist', 'teleportls',
		'tplist', 'tpls',
		'listteleport', 'listtp',
		'lstele', 'lsteleport', 'lstp']
    });
  }

  async isEnabled(chatMessage, player, server) {
    return server.config.enabledPlayerTeleports;
  }

  async run(chatMessage, player, server, args) {

    async function loadTeleports() {
      let playerTeleports = new Array();
      if (args[0] === 'public') {
        server.players = await Player.find({ server: server.id });
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

    let playerTeleports = await loadTeleports();


    if (args.length > 1) {
      return chatMessage.reply('listTeleTooManyArguments');
    }

    if (playerTeleports.length === 0) {
      return chatMessage.reply('listTeleNoTeleportsFound');
    }

    await chatMessage.reply('listTeleResponse', {
      totalTeleports: playerTeleports.length
    });

    for (const teleport of playerTeleports) {
      await chatMessage.reply(`${teleport.publicEnabled ? 'PUBLIC' : 'PRIVATE'}- ${teleport.name} at ${teleport.x},${teleport.y},${teleport.z}`);
    }
  }
}

module.exports = listTele;
