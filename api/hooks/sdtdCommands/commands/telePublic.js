let SdtdCommand = require('../command.js');
const sevenDays = require('machinepack-7daystodiewebapi');

class telePublic extends SdtdCommand {
    constructor(serverId) {
        super(serverId, {
            name: 'telepublic',
        });
        this.serverId = serverId;
        this.name = 'telepublic'
    }

    async run(chatMessage, player, server, args) {

        let playerTeleports = await PlayerTeleport.find({ player: player.id });

        if (server.config.economyEnabled && server.config.costToMakeTeleportPublic) {
            let notEnoughMoney = false
            let result = await sails.helpers.economy.deductFromPlayer.with({
              playerId: player.id,
              amountToDeduct: server.config.costToMakeTeleportPublic,
              message: `COMMAND - ${this.name}`
            }).tolerate('notEnoughCurrency', totalNeeded => {
              notEnoughMoney = true;
            })
            if (notEnoughMoney) {
              return chatMessage.reply(`You do not have enough money to do that! This action costs ${server.config.costToMakeTeleportPublic} ${server.config.currencyName}`)
            }
          }

        if (!server.config.enabledPlayerTeleports) {
            return chatMessage.reply(`This command is disabled! Ask your server admin to enable this.`)
        }

        if (playerTeleports.length == 0) {
            return chatMessage.reply(`Found no teleport location for you!`)
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

        await PlayerTeleport.update({ id: teleportFound.id }, { public: true });
        return chatMessage.reply(`Your teleport ${teleportFound.name} has been set as public.`)



    }
}

module.exports = telePublic;
