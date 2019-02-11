const Commando = require('discord.js-commando');
const fs = require('fs');

class Export extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'export',
      group: 'meta',
      memberName: 'export',
      description: 'Export server database rows',
      hidden: true,
      ownerOnly: true,
      args: [{
        key: 'serverId',
        label: 'ID of the server, duh',
        required: true,
        type: 'string',
        prompt: 'I need the server ID, dummy.'
      }]
    });
  }

  async run(msg, args) {

    let databaseString = new String(`DONT FORGET TO FILL ADDITIONAL VALUES LIKE THE OWNER ID!!\r\n`);

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
      players: players,
      playerClaimItems: playerClaimItems,
      playerTeleports: playerTeleports,
      playerUsedCommands: playerUsedCommands,
      playerUsedGimmes: playerUsedGimmes,
      roles: roles,
      shopListings: shopListings
    };

    Object.getOwnPropertyNames(exportData).map(e => omitDates(e));

   /*  databaseString += "\r\n";
    databaseString += `INSERT INTO sdtdserver (createdAt, updatedAt, id, name, ip, webPort, authName, authToken, owner) \r\n
    VALUES ('${server.createdAt}', '${server.updatedAt}', '${server.id}', '${server.name}', '${server.ip}', '${server.webPort}', '${server.authName}', '${server.authToken}', OWNERID);\r\n`;

    databaseString += "\r\n";
    databaseString += `INSERT INTO sdtdconfig (createdAt, updatedAt, id, commandsEnabled, commandPrefix, discordGuildId, chatChannelId, chatChannelRichMessages, discordNotificationConfig, loggingEnabled, countryBanConfig, motdEnabled, motdMessage, motdOnJoinEnabled, motdInterval, server, enabledPlayerTeleports, enabledCallAdmin, maxPlayerTeleportLocations, playerTeleportTimeout, discordPrefix, memUpdateInfoEnabled, economyEnabled, currencyName, costToTeleport, costToSetTeleport, costToMakeTeleportPublic, playtimeEarnerAmount, playtimeEarnerInterval, playtimeEarnerEnabled, playerTeleportDelay, discordTextEarnerEnabled, discordTextEarnerAmountPerMessage, discordTextEarnerTimeout, discordTextEarnerIgnoredChannels, killEarnerEnabled, playerKillReward, zombieKillReward, inventoryTracking, locationTracking, chatChannelBlockedPrefixes, gblNotificationBans, gblAutoBanEnabled, gblAutoBanBans, pingKickEnabled, maxPing, pingChecksToFail, pingKickMessage, pingWhitelist, enabledWho, costToUseGimme, enabledGimme, gimmeCooldown) \r\n
    VALUES ('${sdtdConfig.createdAt}', '${sdtdConfig.updatedAt}', '${sdtdConfig.id}', '${sdtdConfig.commandsEnabled ? 1 : 0}', '${sdtdConfig.commandPrefix}', '${sdtdConfig.discordGuildId}', '${sdtdConfig.chatChannelId}', '${sdtdConfig.chatChannelRichMessages  ? 1 : 0}', '${JSON.stringify(sdtdConfig.discordNotificationConfig)}', '${sdtdConfig.loggingEnabled  ? 1 : 0}', '${JSON.stringify(sdtdConfig.countryBanConfig)}', '${sdtdConfig.motdEnabled  ? 1 : 0}', '${sdtdConfig.motdMessage}', '${sdtdConfig.motdOnJoinEnabled  ? 1 : 0}', '${sdtdConfig.motdInterval}', '${sdtdConfig.server}', '${sdtdConfig.enabledPlayerTeleports ? 1 : 0}', '${sdtdConfig.enabledCalladmin ? 1 : 0}', '${sdtdConfig.maxPlayerTeleportLocations}', '${sdtdConfig.playerTeleportTimeout}', '${sdtdConfig.discordPrefix}', '${sdtdConfig.memUpdateInfoEnabled  ? 1 : 0}', '${sdtdConfig.economyEnabled  ? 1 : 0}', '${sdtdConfig.currencyName}', '${sdtdConfig.costToTeleport}', '${sdtdConfig.costToSetTeleport}', '${sdtdConfig.costToMakeTeleportPublic}', '${sdtdConfig.playtimeEarnerAmount}', '${sdtdConfig.playtimeEarnerInterval}', '${sdtdConfig.playtimeEarnerEnabled  ? 1 : 0}', '${sdtdConfig.playerTeleportDelay}', '${sdtdConfig.discordTextEarnerEnabled  ? 1 : 0}', '${sdtdConfig.discordTextEarnerAmountPerMessage}', '${sdtdConfig.discordTextEarnerTimeout}', '${sdtdConfig.discordTextEarnerIgnoredChannels}', '${sdtdConfig.killEarnerEnabled  ? 1 : 0}', '${sdtdConfig.playerKillReward}', '${sdtdConfig.zombieKillReward}', '${sdtdConfig.inventoryTracking  ? 1 : 0}', '${sdtdConfig.locationTracking  ? 1 : 0}', '${JSON.stringify(sdtdConfig.chatChannelBlockedPrefixes)}', '${sdtdConfig.gblNotificationBans}', '${sdtdConfig.gblAutoBanEnabled  ? 1 : 0}', '${sdtdConfig.gblAutoBanBans}', '${sdtdConfig.pingKickEnabled  ? 1 : 0}', '${sdtdConfig.maxPing}', '${sdtdConfig.pingChecksToFail}', '${sdtdConfig.pingKickMessage}', '${JSON.stringify(sdtdConfig.pingWhitelist)}', '${sdtdConfig.enabledWho  ? 1 : 0}', '${sdtdConfig.costToUseGimme}', '${sdtdConfig.enabledGimme  ? 1 : 0}', '${sdtdConfig.gimmeCooldown}'); \r\n`

    databaseString += "\r\n";

    for (const cronJob of cronJobs) {
      databaseString += "\r\n";
      databaseString += `INSERT INTO cronjob (createdAt, updatedAt, id, command, temporalValue, enabled, notificationEnabled, server) \r\n
        VALUES ('${cronJob.createdAt}', '${cronJob.updatedAt}', '${cronJob.id}', '${cronJob.command}', '${cronJob.temporalValue}', '${cronJob.enabled  ? 1 : 0}', '${cronJob.notificationEnabled  ? 1 : 0}', '${cronJob.server}'); \r\n`
    }

    for (const customCommand of customCommands) {
      databaseString += "\r\n";
      databaseString += `INSERT INTO customcommand  (createdAt, updatedAt, id, costToExecute, name, aliases, commandsToExecute, enabled, delay, timeout, server, sendOutput, level, description) \r\n
      VALUES ('${customCommand.createdAt}', '${customCommand.updatedAt}', '${customCommand.id}', '${customCommand.costToExecute}', '${customCommand.name}', '${customCommand.aliases}', '${customCommand.commandsToExecute}', '${customCommand.enabled ? 1 : 0}', '${customCommand.delay}', '${customCommand.timeout}', '${customCommand.server}', '${customCommand.sendOutput  ? 1 : 0}', '${customCommand.level}', '${customCommand.description}' ); \r\n`
    }

    for (const argument of customCommandArguments) {
      databaseString += "\r\n";
      databaseString += `INSERT INTO customcommandargument (createdAt, updatedAt, id, \`key\`, type, defaultValue, required, command, allowedValues) \r\n
      VALUES ('${argument.createdAt}', '${argument.updatedAt}', '${argument.id}', '${argument.key}', '${argument.type}','${argument.defaultValue}', '${argument.required ? 1 : 0}', '${argument.command}', '${argument.allowedValues}'); \r\n`;
    }

    for (const notif of customDiscordNotifications) {
      databaseString += "\r\n";
      databaseString += `INSERT INTO customdiscordnotification (createdAt, updatedAt, id, stringToSearchFor, discordChannelId, enabled, ignoreServerChat, server) \r\n
      VALUES ('${notif.createdAt}', '${notif.updatedAt}', '${notif.id}', '${notif.stringToSearchFor}', '${notif.discordChannelId}', '${notif.enabled ? 1 : 0}', '${notif.ignoreServerChat ? 1 : 0}', '${notif.server}'); \r\n`; 
    }

    for (const ban of banEntries) {
      databaseString += "\r\n";
      databaseString += `INSERT INTO banentry (createdAt, updatedAt, id, steamId, note, bannedUntil, reason, unbanned, server) \r\n
      VALUES ('${ban.createdAt}', '${ban.updatedAt}', '${ban.id}', '${ban.steamId}', '${ban.note}', '${ban.bannedUntil}', '${ban.reason}', '${ban.unbanned ? 1 : 0}', '${ban.server}'); \r\n`; 
    }

    for (const comment of gblComments) {
      databaseString += "\r\n";
      databaseString += `INSERT INTO gblcomment (createdAt, updatedAt, id, content, deleted, user, ban) \r\n
      VALUES ('${comment.createdAt}', '${comment.updatedAt}', '${comment.id}', '${comment.content}', '${comment.deleted}', '${comment.user}', '${comment.ban}'); \r\n`; 
    }

    for (const gimme of gimmeItems) {
      databaseString += "\r\n";
      databaseString += `INSERT INTO gimmeitem (createdAt, updatedAt, id, type, value, friendlyName, server) \r\n
      VALUES ('${gimme.createdAt}', '${gimme.updatedAt}', '${gimme.id}', '${gimme.type}', '${gimme.value}', '${gimme.friendlyName}', '${gimme.server}'); \r\n`; 
    }

    for (const player of players) {
      databaseString += "\r\n";
      databaseString += `INSERT INTO player (createdAt, updatedAt, id, steamId, entityId, ip, country, currency, avatarUrl, name, positionX, positionY, positionZ, inventory, playtime, lastOnline, banned, deaths, zombieKills, playerKills, score, level, lastTeleportTime, server, user, role) \r\n
      VALUES ('${player.createdAt}', '${player.updatedAt}', '${player.id}', '${player.steamId}', '${player.entityId}', '${player.ip}', '${player.country}', '${player.currency}','${player.avatarUrl}','${player.name}','${player.positionX}','${player.positionY}','${player.positionZ}','${JSON.stringify(player.inventory)}','${player.playtime}','${player.lastOnline}','${player.banned ? 1 : 0}','${player.deaths}','${player.zombieKills}','${player.playerKills}','${player.score}','${player.level}','${player.lastTeleportTime}','${player.server}', NULL, ${player.role ? player.role : "NULL"}); \r\n`; 
    }

    for (const claimItem of playerClaimItems) {
      databaseString += "\r\n";
      databaseString += `INSERT INTO playerclaimitem (createdAt, updatedAt, id, name, amount, quality, claimed, player) \r\n
      VALUES ('${claimItem.createdAt}', '${claimItem.updatedAt}', '${claimItem.id}', '${claimItem.name}', '${claimItem.amount}', '${claimItem.quality}', '${claimItem.claimed}', ${claimItem.player ? claimItem.player : "NULL"}); \r\n`; 
    }

    for (const teleport of playerTeleports) {
      databaseString += "\r\n";
      databaseString += `INSERT INTO playerteleport (createdAt, updatedAt, id, name, x, y, z, public, timesUsed, player) \r\n
      VALUES ('${teleport.createdAt}', '${teleport.updatedAt}', '${teleport.id}', '${teleport.name}', '${teleport.x}', '${teleport.y}', '${teleport.z}', '${teleport.public ? 1 : 0}', '${teleport.timesUsed}', '${teleport.player}'); \r\n`; 
    }

    for (const usedCmd of playerUsedCommands) {
      databaseString += "\r\n";
      databaseString += `INSERT INTO playerusedcommand (createdAt, updatedAt, id, command, player) \r\n
      VALUES ('${usedCmd.createdAt}', '${usedCmd.updatedAt}', '${usedCmd.id}', '${usedCmd.command}', '${usedCmd.player}'); \r\n`; 
    }

    for (const usedGimme of playerUsedGimmes) {
      databaseString += "\r\n";
      databaseString += `INSERT INTO playerusedgimme (createdAt, updatedAt, id, item, player) \r\n
      VALUES ('${usedGimme.createdAt}', '${usedGimme.updatedAt}', '${usedGimme.id}', '${usedGimme.item}', '${usedGimme.player}'); \r\n`; 
    }


    for (const role of roles) {
      databaseString += "\r\n";
      databaseString += `INSERT INTO role (createdAt, updatedAt, id, name, level, isDefault, amountOfTeleports, radiusAllowedToExplore, economyGiveMultiplier, economyDeductMultiplier, discordRole, manageServer, manageEconomy, managePlayers, manageTickets, viewAnalytics, viewDashboard, useTracking, useChat, useCommands, manageGbl, discordExec, discordLookup, server) \r\n
      VALUES ('${role.createdAt}', '${role.updatedAt}', '${role.id}', '${role.name}', '${role.level}', '${role.isDefault ? 1 : 0}', '${role.amountOfTeleports}', '${role.radiusAllowedToExplore}','${role.economyGiveMultiplier}', '${role.economyDeductMultiplier}','${role.discordRole}','${role.manageServer ? 1 : 0}','${role.manageEconomy ? 1 : 0}','${role.managePlayers ? 1 : 0}','${role.manageTickets ? 1 : 0}','${role.viewAnalytics ? 1 : 0}','${role.viewDashboard ? 1 : 0}','${role.useTracking ? 1 : 0}','${role.useChat ? 1 : 0}','${role.useCommands ? 1 : 0}','${role.manageGbl ? 1 : 0}','${role.discordExec ? 1 : 0}','${role.discordLookup ? 1 : 0}','${role.server}'); \r\n`; 
    }

    for (const listing of shopListings) {
      databaseString += "\r\n";
      databaseString += `INSERT INTO shoplisting (createdAt, updatedAt, id, name, friendlyName, amount, quality, price, timesBought, server, createdBy) \r\n
      VALUES ('${listing.createdAt}', '${listing.updatedAt}', '${listing.id}', '${listing.name}', '${listing.friendlyName}', '${listing.amount}', '${listing.quality}', '${listing.price}', '${listing.timesBought}', '${listing.server}', ${listing.createdBy ? listing.createdBy : "NULL"}); \r\n`; 
    } */


    fs.writeFile(`${server.name}_export.json`, JSON.stringify(exportData), async function () {
      await msg.channel.send({
        files: [{
          attachment: `${server.name}_export.json`,
          name: `${server.name}_export.json`
        }]
      });
  
      fs.unlinkSync(`${server.name}_export.json`);
    });

  }

}


module.exports = Export;

function omitDates(object) {
  if (_.isArray(object)) {
    return object.map(e => _.omit(e, 'createdAt', 'updatedAt'))
  } else {
    return _.omit(object, 'createdAt', 'updatedAt');
  }
}
