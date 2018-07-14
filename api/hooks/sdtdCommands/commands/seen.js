let SdtdCommand = require('../command.js');

class Seen extends SdtdCommand {
  constructor(serverId) {
    super(serverId, {
      name: 'seen',
      description: "Check when a player was last online",
      extendedDescription: "Arguments: playername or steam/entity ID",
      aliases: ["lastseen", "lastonline"]
    });
    this.serverId = serverId;
  }

  async isEnabled(chatMessage, player, server, args) {
    return true
  }

  async run(chatMessage, player, server, args) {

    let foundPlayer = await sails.models.player.find({
        server: server.id,
        or: [
            {
                name: {
                    'contains': args[0]
                },
            },
            { entityId: isNaN(parseInt(args[0])) ? -1 : args[0] },
            { steamId: args[0] },
        ]
    });
    
    if (foundPlayer.length > 1) {
        return chatMessage.reply(`Found ${foundPlayer.length} players for that query, please specify further or use ID.`)
    }

    if (foundPlayer.length === 0) {
        return chatMessage.reply(`No player found!`);
    }

    foundPlayer = foundPlayer[0];

    let lastOnlineDate = new Date(foundPlayer.lastOnline);
    let humanDuration = await sails.helpers.etc.humanizedTime(lastOnlineDate);

    if (humanDuration === "0 seconds ago") {
        chatMessage.reply(`${foundPlayer.name} is online right now!`)
    } else {
        chatMessage.reply(`${foundPlayer.name} was last seen on ${lastOnlineDate.toDateString()} at ${lastOnlineDate.toTimeString()}. That's ${humanDuration}`);
    }

  }
}

module.exports = Seen;
