module.exports = {
  friendlyName: 'Export server',
  inputs: {
    serverId: {
      type: 'number'
    },
  },

  exits: {},

  fn: async function (inputs, exits) {
    const server = await SdtdServer.findOne(inputs.serverId);

    if (_.isUndefined(server)) {
      throw new Error(`Unknown server`);
    }
    const sdtdConfig = await SdtdConfig.findOne({
      server: server.id
    });

    const cronJobs = await CronJob.find({
      server: server.id
    });
    const customCommands = await CustomCommand.find({
      server: server.id
    });
    const customCommandArguments = await CustomCommandArgument.find({
      command: customCommands.map(c => c.id)
    });
    const customDiscordNotifications = await CustomDiscordNotification.find({
      server: server.id
    });
    const banEntries = await BanEntry.find({
      server: server.id
    });
    const gblComments = await GblComment.find({
      ban: banEntries.map(b => b.id)
    });
    const gimmeItems = await GimmeItem.find({
      server: server.id
    });
    const players = await Player.find({
      server: server.id
    });
    const playerClaimItems = await PlayerClaimItem.find({
      player: players.map(p => p.id),
      claimed: false
    });
    const playerTeleports = await PlayerTeleport.find({
      player: players.map(p => p.id)
    });
    const playerUsedCommands = await PlayerUsedCommand.find({
      player: players.map(p => p.id)
    });
    const playerUsedGimmes = await PlayerUsedGimme.find({
      player: players.map(p => p.id)
    });
    const roles = await Role.find({
      server: server.id
    });
    const shopListings = await ShopListing.find({
      server: server.id
    });

    const customHooks = await CustomHook.find({
      server: server.id
    });

    server.toJSON = undefined;

    return exits.success({
      server: server,
      config: sdtdConfig,
      cronJobs: cronJobs,
      customCommands: customCommands,
      customArgs: customCommandArguments,
      customDiscordNotifications: customDiscordNotifications,
      banEntries: banEntries,
      gblComments: gblComments,
      gimmeItems: gimmeItems,
      players: players.map(player => _.omit(player, 'user', 'inventory')),
      playerClaimItems: playerClaimItems,
      playerTeleports: playerTeleports,
      playerUsedCommands: playerUsedCommands,
      playerUsedGimmes: playerUsedGimmes,
      roles: roles,
      shopListings: shopListings,
      customHooks: customHooks
    });
  },
};


