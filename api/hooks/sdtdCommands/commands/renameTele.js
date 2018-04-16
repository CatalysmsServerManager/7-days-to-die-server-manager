let SdtdCommand = require('../command.js');
const sevenDays = require('machinepack-7daystodiewebapi');
var validator = require('validator');

class renameTele extends SdtdCommand {
  constructor(serverId) {
    super(serverId, {
      name: 'renametele',
    });
    this.serverId = serverId;
  }

  async run(chatMessage, player, server, args) {

    let playerTeleports = await PlayerTeleport.find({ player: player.id });

    if (!server.config.enabledPlayerTeleports) {
      return chatMessage.reply('Command disabled - ask your server owner to enable this!');
    }

    if (args.length == 0) {
      return chatMessage.reply('Please provide a name for your teleport and a new name');
    }

    if (args.length > 2) {
      return chatMessage.reply(`Too many arguments! Just provide a teleport name and new name please.`)
    }

    let teleportFound = false
    playerTeleports.forEach(teleport => {
      if (teleport.name == args[0]) {
        teleportFound = teleport
      }
    })

    if (!teleportFound) {
      return chatMessage.reply(`No teleport with that name found`)
    }

    let nameAlreadyInUse = false
    playerTeleports.forEach(teleport => {
      if (teleport.name == args[1]) {
        nameAlreadyInUse = true
      }
    })

    if (nameAlreadyInUse) {
      return chatMessage.reply(`That name is already in use! Pick another one please.`)
    }

    if (!validator.isAlphanumeric(args[1])) {
      return chatMessage.reply(`Only alphanumeric values are allowed for teleport names.`)
    }

    await PlayerTeleport.update({ id: teleportFound.id }, { name: args[1] });

    return chatMessage.reply(`Your teleport ${teleportFound.name} was renamed to ${args[1]}`)
  }
}

module.exports = renameTele;
