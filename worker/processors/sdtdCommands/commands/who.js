const SdtdCommand = require('../command.js');
const validator = require('validator');

class Who extends SdtdCommand {
  constructor() {
    super({
      name: 'who',
      description: 'See who was in your area',
      extendedDescription: 'You can provide a optional size argument. For most accurate results, try to keep the size as small as possible',
      aliases: ['track', 'search']
    });
  }

  async isEnabled(chatMessage, player, server) {
    return server.config.enabledWho && server.config.locationTracking;
  }

  async run(chatMessage, player, server, args) {

    let size = 150;

    if (args[0]) {
      if (validator.isInt(args[0])) {
        size = parseInt(args[0]);
      }
    }

    if (size > 500) {
      size = 500;
    }


    let foundTrackingData = await TrackingInfo.find({
      where: {
        server: server.id,
        x: {
          '>': player.positionX - size,
          '<': player.positionX + size
        },
        z: {
          '>': player.positionZ - size,
          '<': player.positionZ + size
        }
      },
      sort: 'createdAt DESC'
    });

    if (foundTrackingData.length === 0) {
      return chatMessage.reply('whoNoDataFound');
    }

    let foundPlayers = foundTrackingData.map(dataPoint => dataPoint.player);
    let uniquePlayers = _.uniq(foundPlayers);
    let dateOldest = new Date(foundTrackingData[foundTrackingData.length - 1].createdAt);

    let playerRecords = await Player.find({
      id: uniquePlayers
    });

    let playersnames = new String('List: ');

    for (const foundPlayer of playerRecords) {
      playersnames += foundPlayer.name + ', ';
    }

    await chatMessage.reply(`whoSuccess`, {
      totalPlayers: uniquePlayers.length,
      radius: size,
      date: dateOldest.toLocaleDateString(),
      time: dateOldest.toLocaleTimeString()
    });
    await chatMessage.reply(playersnames);
  }
}

module.exports = Who;
