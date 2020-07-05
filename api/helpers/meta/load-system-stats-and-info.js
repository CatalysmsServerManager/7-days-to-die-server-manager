const hhmmss = require('@streammedev/hhmmss');

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
    let amountOfCustomHooks = await CustomHook.count();

    let uptime = hhmmss(process.uptime());

    let amountOfChatBridges = sails.hooks.discordchatbridge.getAmount();
    let amountOfCountryBans = sails.hooks.countryban.getAmount();
    let amountOfIngameCommandHandlers = sails.hooks.sdtdcommands.getAmount();

    let currencyTotal = await Player.sum('currency');
    let currencyAvg = await Player.avg('currency');

    let gblEntries = await BanEntry.count();
    let cronJobs = await CronJob.count({
      enabled: true
    });
    let pingKickers = await SdtdConfig.count({
      pingKickEnabled: true
    });
    let openTickets = await SdtdTicket.count({
      status: true
    });
    let closedTickets = await SdtdTicket.count({
      status: false
    });

    let gblComments = await GblComment.count({
      deleted: false
    });

    let response = {
      servers: amountOfServers,
      players: amountOfPlayers,
      guilds: amountOfDiscordGuilds,
      users: amountOfOnlineDiscordUsers,
      uptime: uptime,
      chatBridges: amountOfChatBridges,
      countryBans: amountOfCountryBans,
      sdtdCommands: amountOfIngameCommandHandlers,
      customHooks: amountOfCustomHooks,
      amountOfTimesTeleported: amountOfTimesTeleported,
      amountOfTeleports: amountOfTeleports,
      amountOfCustomCommands: amountOfCustomCommands,
      amountOfCustomCommandsExecuted: amountOfCustomCommandsExecuted,
      currencyTotal: currencyTotal,
      currencyAvg: currencyAvg,
      gblEntries: gblEntries,
      cronJobs: cronJobs,
      pingKickers: pingKickers,
      openTickets: openTickets,
      closedTickets: closedTickets,
      gblComments: gblComments,
    };

    return exits.success(response);

  }


};
