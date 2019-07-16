const Commando = require('discord.js-commando');
const Discord = require('discord.js');
const findSdtdServer = require('../../util/findSdtdServer.js');
const checkIfAdmin = require('../../util/checkIfAdmin');
const Daystodiewebapi = require('machinepack-7daystodiewebapi');
const fs = require('fs');

class ExecCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'execcommand',
      aliases: ['telnet', 'ex'],
      format: 'execcommand command arguments',
      guildOnly: true,
      group: 'sdtd',
      args: [{
          key: 'command',
          label: 'Command to be executed',
          prompt: 'Specify a command please',
          type: 'string',
          required: true
        },
        {
          key: 'server',
          default: 1,
          type: 'integer',
          prompt: 'Please specify what server to run this commmand for!'
        }
      ],
      memberName: 'execcommand',
      description: 'Executes a console command',
      details: "Only administrators can use this command",
      examples: ['ex help', 'ex mem']
    })
  }

  async run(msg, args) {
    let sdtdServers = await findSdtdServer(msg);

    if (!sdtdServers.length === 0) {
      return msg.channel.send(`Could not find a server to execute this command for. You can link this guild to your server on the website.`);
    }

    let sdtdServer = sdtdServers[args.server - 1];

    if (!sdtdServer) {
      return msg.channel.send(`Did not find server ${args.server}! Check your config please.`)
    }

    let permCheck = await sails.helpers.roles.checkPermission.with({
      serverId: sdtdServer.id,
      discordId: msg.author.id,
      permission: 'discordExec'
    });

    if (!permCheck.hasPermission) {
      let errorEmbed = new this.client.errorEmbed(`You do not have sufficient permissions to execute this command. Your registered role is ${permCheck.role.name}. Contact your server admin if you think you should have a higher role.`)

      let usersWithDiscordId = await User.find({
        discordId: msg.author.id
      });

      if (usersWithDiscordId.length === 0) {
        errorEmbed.addField(`No users with your discord ID ${msg.author.id} found!`, "Link your Discord profile to CSMM first.")
      }
      return msg.channel.send(errorEmbed)
    }

    // Execute a command via web api
    Daystodiewebapi.executeCommand({
      ip: sdtdServer.ip,
      port: sdtdServer.webPort,
      command: args.command,
      authName: sdtdServer.authName,
      authToken: sdtdServer.authToken,
    }).exec({
      // An unexpected error occurred.
      error: function (err) {
        let errorEmbed = new client.errorEmbed(`${err.message}`)
        return msg.channel.send(errorEmbed)
      },
      // Server refused the request (usually means server offline)
      connectionRefused: function () {
        let errorEmbed = new client.errorEmbed(`:octagonal_sign: Error connecting to the server`)
        return msg.channel.send(errorEmbed)
      },
      // Not authorized to do this request
      unauthorized: function () {
        let errorEmbed = new client.errorEmbed(`:octagonal_sign: Not authorized to execute a command (Check your webtokens config!)`)
        return msg.channel.send(errorEmbed)
      },
      // Unknown command entered
      unknownCommand: function () {
        let errorEmbed = new client.errorEmbed(`:octagonal_sign: Unknown command`)
        return msg.channel.send(errorEmbed)
      },
      // OK.
      success: async function (response) {
        let successEmbed = new Discord.RichEmbed()
        successEmbed.addField(':inbox_tray: Input', `${args.command}`)
          .setColor('GREEN')

        if (response.result.length > 1000) {
          try {
            fs.writeFile(`${sdtdServer.name}_${args.command}_output.txt`, response.result, err => {
              if (err) {
                sails.log.error(err)
              }
              successEmbed.addField(':outbox_tray: Output', `Logging to file`)
              msg.channel.send({
                embed: successEmbed,
                files: [{
                  attachment: `${sdtdServer.name}_${args.command}_output.txt`,
                  name: `${sdtdServer.name}_${args.command}_output.txt`
                }]
              }).then(response => {
                fs.unlink(`${sdtdServer.name}_${args.command}_output.txt`, err => {
                  if (err) {
                    sails.log.error(err)
                  }
                })
              }).catch(e => {
                sails.log.error(`DISCORD COMMAND - EXECCOMMAND - ${e}`)
              })
            });
          } catch (error) {
            sails.log.error(`DISCORD COMMAND - EXECCOMMAND - ${error}`)
          }

        } else {
          successEmbed.addField(':outbox_tray: Output', `${response.result ? response.result : "No output data"}`)
          return msg.channel.send(successEmbed)
        }


      },

    });

  }

}


module.exports = ExecCommand;
