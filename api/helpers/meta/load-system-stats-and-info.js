const hhmmss = require('@streammedev/hhmmss')

module.exports = {


  friendlyName: 'Load system stats and info',


  description: '',


  inputs: {

  },


  exits: {

  },


  fn: async function (inputs, exits) {

    let discordClient = sails.hooks.discordbot.getClient();
    let amountOfDiscordGuilds = discordClient.guilds.size;
    let amountOfOnlineDiscordUsers = discordClient.users.size;

    let amountOfServers = await SdtdServer.count();
    let amountOfPlayers = await Player.count();

    let amountOfTeleports = await PlayerTeleport.count();
    let amountOfTimesTeleported = await PlayerTeleport.sum('timesUsed');

    let amountOfCustomCommands = await CustomCommand.count();
    let amountOfCustomCommandsExecuted = await PlayerUsedCommand.count();

    let uptime = hhmmss(process.uptime())

    let amountOfChatBridges = sails.hooks.discordchatbridge.getAmount();
    let amountOfCountryBans = sails.hooks.countryban.getAmount();
    let amountOfIngameCommandHandlers = sails.hooks.sdtdcommands.getAmount();
    let amountOfMotdHandlers = sails.hooks.sdtdmotd.getAmount();

    let currencyTotal = await Player.sum('currency');
    let currencyAvg = await Player.avg('currency');

    let response = {
      servers: amountOfServers,
      players: amountOfPlayers,
      guilds: amountOfDiscordGuilds,
      users: amountOfOnlineDiscordUsers,
      uptime: uptime,
      chatBridges: amountOfChatBridges,
      countryBans: amountOfCountryBans,
      sdtdCommands: amountOfIngameCommandHandlers,
      sdtdMotds: amountOfMotdHandlers,
      amountOfTimesTeleported: amountOfTimesTeleported,
      amountOfTeleports: amountOfTeleports,
      amountOfCustomCommands: amountOfCustomCommands,
      amountOfCustomCommandsExecuted: amountOfCustomCommandsExecuted,
      currencyTotal: currencyTotal,
      currencyAvg: currencyAvg
    }

    return exits.success(response)

  }


};
