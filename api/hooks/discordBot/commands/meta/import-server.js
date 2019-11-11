const Commando = require("discord.js-commando");
const RichEmbed = require("discord.js").RichEmbed;
const fs = require("fs");
const request = require("request-promise-native");

let statusMessage;
let statusEmbed = new RichEmbed();
let embedDescription = new String();

class Import extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "import",
      group: "meta",
      memberName: "import",
      description: "import server database rows",
      hidden: true,
      ownerOnly: true
    });
  }

  async run(msg, args) {
    const fileUrl = msg.attachments.first().url;
    await this.downloadFile(fileUrl);
    let data = require("../../../../../import.json");

    // Without this, it fails sometimes. Idk why :)
    console.log(data);

    const importedRoles = new Array();

    embedDescription = new String();
    statusEmbed = new RichEmbed();

    statusEmbed.setFooter(`0/${Object.keys(data).length} tables loaded`);
    statusEmbed.setTitle(`Import status for ${data.server.name}`);
    statusEmbed.setColor("ORANGE");
    statusMessage = await msg.channel.send(statusEmbed);
    this.addDescriptionLine(
      "Importing server connection data and configuration"
    );

    try {
      const server = await SdtdServer.create(this.omitId(data.server)).fetch();
      data.config.server = server.id;
      const config = await SdtdConfig.create(this.omitId(data.config)).fetch();

      statusEmbed.setFooter(`2/${Object.keys(data).length} tables loaded`);
      this.addDescriptionLine(`Importing ${data.cronJobs.length} cronjobs`);

      data.cronJobs = this.setServerIdForArray(data.cronJobs, server.id);

      for (const cronJob of data.cronJobs) {
        await CronJob.create(this.omitId(cronJob));
      }

      statusEmbed.setFooter(`3/${Object.keys(data).length} tables loaded`);
      this.addDescriptionLine(
        `Importing ${data.customCommands.length} custom commands with ${data.customArgs.length} custom arguments`
      );

      data.customCommands = this.setServerIdForArray(
        data.customCommands,
        server.id
      );

      for (const customCmd of data.customCommands) {
        let createdCmd = await CustomCommand.create(
          this.omitId(customCmd)
        ).fetch();
        let customArgs = data.customArgs
          .filter(arg => arg.command.toString() === customCmd.id.toString())
          .map(arg => {
            arg.command = createdCmd.id;
            return arg;
          });

        for (const arg of customArgs) {
          await CustomCommandArgument.create(this.omitId(arg));
        }
      }

      statusEmbed.setFooter(`5/${Object.keys(data).length} tables loaded`);
      this.addDescriptionLine(
        `Importing ${data.customDiscordNotifications.length} custom discord notifications.`
      );

      data.customDiscordNotifications = this.setServerIdForArray(
        data.customDiscordNotifications,
        server.id
      );
      for (const notification of data.customDiscordNotifications) {
        await CustomDiscordNotification.create(this.omitId(notification));
      }

      statusEmbed.setFooter(`6/${Object.keys(data).length} tables loaded`);
      this.addDescriptionLine(
        `Importing ${data.banEntries.length} GBL entries with ${data.gblComments.length} comments.`
      );

      data.banEntries = this.setServerIdForArray(data.banEntries, server.id);
      for (const gblEntry of data.banEntries) {
        let createdEntry = await BanEntry.create(this.omitId(gblEntry)).fetch();
        let entryComments = data.gblComments
          .filter(comment => comment.ban.toString() === gblEntry.id.toString())
          .map(comment => {
            comment.ban = createdEntry.id;
            return comment;
          });

        for (const comment of entryComments) {
          await GblComment.create(this.omitId(comment));
        }
      }

      statusEmbed.setFooter(`8/${Object.keys(data).length} tables loaded`);
      this.addDescriptionLine(
        `Importing ${data.gimmeItems.length} gimme objects`
      );

      data.gimmeItems = this.setServerIdForArray(data.gimmeItems, server.id);

      for (const gimmeItem of data.gimmeItems) {
        await GimmeItem.create(this.omitId(gimmeItem));
      }

      statusEmbed.setFooter(`9/${Object.keys(data).length} tables loaded`);
      this.addDescriptionLine(`Importing ${data.roles.length} roles`);

      data.roles = this.setServerIdForArray(data.roles, server.id);
      for (const role of data.roles) {
        let createdRole = await Role.create(this.omitId(role)).fetch();
        importedRoles.push(createdRole);
      }

      statusEmbed.setFooter(`10/${Object.keys(data).length} tables loaded`);
      this.addDescriptionLine(
        `Importing ${data.players.length} players - ${data.playerTeleports.length} teleport locations`
      );

      data.players = this.setServerIdForArray(data.players, server.id);

      for (const player of data.players) {
        if (player.role) {
          let oldRole = data.roles.filter(
            r => r.id.toString() === player.role.toString()
          )[0];
          if (!_.isUndefined(oldRole)) {
            let newRole = importedRoles.filter(
              r => r.level.toString() === oldRole.level.toString()
            )[0];
            player.role = newRole.id;
          } else {
            player.role = null;
          }
        }

        let createdEntry = await Player.create(this.omitId(player)).fetch();
        let teleports = data.playerTeleports
          .filter(
            teleport => teleport.player.toString() === player.id.toString()
          )
          .map(teleport => {
            teleport.player = createdEntry.id;
            return teleport;
          });

        for (const teleport of teleports) {
          await PlayerTeleport.create(this.omitId(teleport));
        }
      }

      statusEmbed.setFooter(`11/${Object.keys(data).length} tables loaded`);
      this.addDescriptionLine(
        `Importing ${data.shopListings.length} shop listings`
      );

      data.shopListings = this.setServerIdForArray(
        data.shopListings,
        server.id
      );

      for (const listing of data.shopListings) {
        await ShopListing.create(this.omitId(listing));
      }

      statusEmbed.setFooter(`12/${Object.keys(data).length} tables loaded`);
      this.addDescriptionLine(
        `Importing ${data.customHooks.length} custom hooks`
      );

      data.customHooks = this.setServerIdForArray(data.customHooks, server.id);

      for (const hook of data.customHooks) {
        await CustomHook.create(this.omitId(hook));
      }

      statusEmbed.setFooter(`All tables loaded, yay!`);
      statusEmbed.setColor("GREEN");
      this.addDescriptionLine(`Finished import of server ${server.name}`);

      try {
        fs.unlinkSync("import.json");
      } catch (error) {
        sails.log.error("Error deleting import file");
      }
    } catch (error) {
      sails.log.error(error);
      this.addDescriptionLine(`An error occured! Check logs for more info`);
      this.addDescriptionLine(error.toString());
    }
  }

  setServerIdForArray(array, serverId) {
    return array.map(element => {
      element.server = serverId;
      return element;
    });
  }

  addDescriptionLine(newLine) {
    let now = new Date();
    embedDescription += `${now.toLocaleTimeString()} - ${newLine}\n`;
    this.updateStatusMessage();
  }

  omitId(object) {
    return _.omit(object, "id");
  }

  async updateStatusMessage() {
    statusEmbed.setDescription(embedDescription);
    statusMessage = await statusMessage.edit(undefined, statusEmbed);
    return statusMessage;
  }

  downloadFile(url) {
    let file = fs.createWriteStream("import.json");
    return new Promise((resolve, reject) => {
      const stream = request(url)
        .pipe(file)
        .on("finish", () => {
          sails.log.info(`Finished downloading file for import`);
          resolve();
        })
        .on("error", error => {
          sails.log.error(error);
          reject(error);
        });
    });
  }
}

module.exports = Import;
