let SdtdCommand = require('../command.js')
const sevenDays = require('machinepack-7daystodiewebapi');

class callAdmin extends SdtdCommand {
  constructor(serverId) {
    super(serverId, {
      name: 'calladmin',
    })
    this.serverId = serverId
  }

  async run(chatMessage, playerId, args) {
    sails.log.debug(`HOOK - SdtdCommands:callAdmin - Player ${playerId} ran callAdmin command`);

    try {
      let ticket = await sails.helpers.sdtd.createTicket(
        this.serverId,
        playerId,
        args.join(' ')
      )
      let server = await SdtdServer.findOne({
        id: this.serverId
      })
      let player = await Player.findOne({
        id: playerId
      })

      sevenDays.sendMessage({
        ip: server.ip,
        port: server.webPort,
        authName: server.authName,
        authToken: server.authToken,
        message: `Your ticket has been created, check the website to follow up!`,
        playerId: player.steamId
      }).exec({
          error: (error) => {
            sails.log.error(`HOOK - SdtdCommands:callAdmin - Failed to respond to player`)
          },
          success: (result) => {
              return ticket
          }
      })

    } catch (error) {
      sails.log.error(`HOOK - SdtdCommands:callAdmin - ${error}`)
    }
  }
}

module.exports = callAdmin
