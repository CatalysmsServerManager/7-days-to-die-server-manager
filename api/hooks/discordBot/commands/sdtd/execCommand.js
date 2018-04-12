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
            }],
            memberName: 'execcommand',
            description: 'Executes a console command',
            details: "Only administrators can use this command",
            examples: ['ex help', 'ex mem']
        })
    }

    async run(msg, args) {
        let sdtdServer = await findSdtdServer(msg);

        if (!sdtdServer) {
            let errorEmbed = new client.errorEmbed(`Could not find a server to execute this command for! Make sure to add your server via the website and configure a channel to execute commands in.`)
            return msg.channel.send(errorEmbed)
        }

        let isAdmin = await checkIfAdmin(msg.author.id, sdtdServer.id);
        if (!isAdmin) {
            let errorEmbed = new client.errorEmbed(`You are not authorized to execute commands! The server owner can add you as admin on the website`)
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
                let successEmbed = new Discord.MessageEmbed()
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
                    successEmbed.addField(':outbox_tray: Output', `${response.result}`)
                    return msg.channel.send(successEmbed)
                }


            },

        });

    }

}


module.exports = ExecCommand;
