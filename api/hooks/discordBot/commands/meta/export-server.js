const Commando = require("discord.js-commando");
const fs = require("fs");

class Export extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "export",
      group: "meta",
      memberName: "export",
      description: "Export server database rows",
      hidden: true,
      ownerOnly: true,
      args: [
        {
          key: "serverId",
          label: "ID of the server, duh",
          required: true,
          type: "string",
          prompt: "I need the server ID, dummy."
        }
      ]
    });
  }

  async run(msg, args) {
    let databaseString = new String(
      `DONT FORGET TO FILL ADDITIONAL VALUES LIKE THE OWNER ID!!\r\n`
    );

    const server = await SdtdServer.findOne(args.serverId);

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

    const exportData = {
      server: server,
      config: sdtdConfig,
      cronJobs: cronJobs,
      customCommands: customCommands,
      customArgs: customCommandArguments,
      customDiscordNotifications: customDiscordNotifications,
      banEntries: banEntries,
      gblComments: gblComments,
      gimmeItems: gimmeItems,
      players: players.map(player => _.omit(player, "user", "inventory")),
      playerClaimItems: playerClaimItems,
      playerTeleports: playerTeleports,
      playerUsedCommands: playerUsedCommands,
      playerUsedGimmes: playerUsedGimmes,
      roles: roles,
      shopListings: shopListings,
      customHooks: customHooks
    };

    Object.getOwnPropertyNames(exportData).map(e => omitDates(e));

    fs.writeFile(
      `${server.name}_export.json`,
      JSON.stringify(exportData),
      async function() {
        await msg.channel.send({
          files: [
            {
              attachment: `${server.name}_export.json`,
              name: `${server.name}_export.json`
            }
          ]
        });

        fs.unlinkSync(`${server.name}_export.json`);
      }
    );
  }
}

module.exports = Export;

function omitDates(object) {
  if (_.isArray(object)) {
    return object.map(e => _.omit(e, "createdAt", "updatedAt"));
  } else {
    return _.omit(object, "createdAt", "updatedAt");
  }
}
