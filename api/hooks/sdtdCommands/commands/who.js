let SdtdCommand = require('../command.js');
const sevenDays = require('machinepack-7daystodiewebapi');
const validator = require('validator');
const he = require('he');

class Who extends SdtdCommand {
    constructor(serverId) {
        super(serverId, {
            name: 'who',
            description: "See who was in your area",
            extendedDescription: "You can provide a optional size argument. For most accurate results, try to keep the size as small as possible",
            aliases: ["track", "search"]
        });
        this.serverId = serverId;
    }

    async isEnabled(chatMessage, player, server, args) {
        return true
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
            sort: "createdAt DESC"
        });

        let foundPlayers = foundTrackingData.map(dataPoint => dataPoint.player);
        let uniquePlayers = _.uniq(foundPlayers);
        let dateOldest = new Date(foundTrackingData[foundTrackingData.length - 1].createdAt);

        let playerRecords = await Player.find({ id: uniquePlayers });

        let playersnames = new String("List: ");

        for (const foundPlayer of playerRecords) {
            playersnames += he.decode(foundPlayer.name) + ", "
        }

        sails.log.info(`${player.name} on ${server.name} found ${uniquePlayers.length} players in his location`);
        chatMessage.reply(`${uniquePlayers.length} player${uniquePlayers.length === 1 ? " has" : "s have"} been in a radius of ${size} blocks around your current location since ${dateOldest.toLocaleDateString()} ${dateOldest.toLocaleTimeString()}`);
        chatMessage.reply(playersnames);

    }
}

module.exports = Who;
