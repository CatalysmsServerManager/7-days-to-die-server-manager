let SdtdCommand = require('../command.js');

class Seen extends SdtdCommand {
  constructor(serverId) {
    super(serverId, {
      name: 'seen',
      description: 'Check when a player was last online',
      extendedDescription: 'Arguments: playername or steam/entity ID',
      aliases: ['lastseen', 'lastonline']
    });
    this.serverId = serverId;
  }

  async isEnabled() {
    return true;
  }

  async run(chatMessage, player, server, args) {

    if (!args[0]) {
      return chatMessage.reply(`seenMissingArguments`);
    }

    let foundPlayer = await sails.models.player.find({
      server: server.id,
      or: [{
        name: {
          'contains': args[0]
        },
      },
      {
        entityId: isNaN(parseInt(args[0])) ? -1 : args[0]
      },
      {
        steamId: args[0]
      },
      ]
    });

    if (foundPlayer.length > 1) {
      return chatMessage.reply(`seenTooManyPlayers`, {
        amount: foundPlayer.length
      });
    }

    if (foundPlayer.length === 0) {
      return chatMessage.reply(`seenNoPlayerFound`);
    }

    foundPlayer = foundPlayer[0];

    let lastOnlineDate = new Date(foundPlayer.lastOnline);
    let humanDuration = await sails.helpers.etc.humanizedTime(lastOnlineDate);

    if (humanDuration === '0 seconds ago') {
      chatMessage.reply(`seenOnlineNow`, {
        foundPlayer: foundPlayer
      });
    } else {
      chatMessage.reply(`seenSuccess`, {
        foundPlayer: foundPlayer,
        date: lastOnlineDate.toDateString(),
        time: lastOnlineDate.toTimeString(),
        humanDuration: humanDuration
      });
    }

  }
}

module.exports = Seen;
