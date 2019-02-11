const Commando = require('discord.js-commando');
const RichEmbed = require('discord.js').RichEmbed;
const fs = require('fs');

let statusMessage;
let statusEmbed = new RichEmbed();
let embedDescription = new String();

class Import extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'import',
      group: 'meta',
      memberName: 'import',
      description: 'import server database rows',
      hidden: true,
      ownerOnly: true,
    });
  }

  async run(msg, args) {
    let data = require("../../../../../import.json");
    sails.log.debug(data);

    statusEmbed.setFooter(`0/${Object.keys(data).length} tables loaded`);
    statusEmbed.setTitle(`Import status for ${data.server.name}`);
    statusEmbed.setColor('ORANGE');
    statusMessage = await msg.channel.send(statusEmbed);
    this.addDescriptionLine('Importing server connection data and configuration');

    try {
      const server = await SdtdServer.create(this.omitId(data.server)).fetch();
      data.config.server = server.id;
      const config = await SdtdConfig.create(this.omitId(data.config)).fetch();

      statusEmbed.setFooter(`2/${Object.keys(data).length} tables loaded`);
      this.addDescriptionLine(`Importing ${data.cronJobs.length} cronjobs`);

      data.cronJobs = this.setServerIdForArray(data.cronJobs, server.id);

      for (const cronJob of data.cronJobs) {
        await CronJob.create(cronJob);
      }

      statusEmbed.setFooter(`3/${Object.keys(data).length} tables loaded`);

      this.addDescriptionLine(`Importing ${data.customCommands.length} custom commands with ${data.customArgs.length} custom arguments`);

      data.customCommands = this.setServerIdForArray(data.customCommands, server.id);

      for (const customCmd of data.customCommands) {
        let createdCmd = await CustomCommand.create(customCmd).fetch();
        let customArgs = data.customArgs.filter(arg => arg.command.toString() === customCmd.id.toString()).map(arg => {
          arg.command = createdCmd;
          return arg;
        });

        for (const arg of customArgs) {
          await CustomCommandArgument.create(this.omitId(arg));
        }

      }

      statusEmbed.setFooter(`5/${Object.keys(data).length} tables loaded`);

      this.addDescriptionLine(`Importing ${data.customDiscordNotifications.length} custom discord notifications.`);

      // To be continued...

    } catch (error) {
      this.addDescriptionLine(`!!! An error occured !!!`);
      this.addDescriptionLine(error);
    }
  }

  setServerIdForArray(array, serverId) {
    return array.map(element => {
      element.server = serverId;
      return this.omitId(element);
    });
  }

  addDescriptionLine(newLine) {
    let now = new Date();
    embedDescription += `${now.toLocaleTimeString()} - ${newLine}\n`;
    this.updateStatusMessage();
  }

  omitId(object) {
    return _.omit(object, 'id');
  }


  async updateStatusMessage() {
    statusEmbed.setDescription(embedDescription);
    statusMessage = await statusMessage.edit(undefined, statusEmbed);
    return statusMessage;
  }

}


module.exports = Import;
