const Commando = require('discord.js-commando');
const ChatBridgeChannel = require('../../util/chatBridgeChannel.js')

/**
 * @memberof module:DiscordCommands
 * @name ChatBridge
 * @description Adds a server to the system
 * @param {string} ip
 * @param {integer} webPort
 * @param {integer} telnetPort
 * @param {string} telnetPassword
 */

class ChatBridge extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'chatbridge',
      group: '7dtd',
      aliases: ['cb'],
      memberName: 'chatbridge',
      args: [{
        key: 'option',
        label: 'Option',
        prompt: 'Specify an option for this command please',
        type: 'string'
      }],
      description: 'Command for managing chat bridges',
      details: "For more information see the website",
      userPermissions: ["MANAGE_GUILD"]
    });
  }

  async run(msg, args) {

    let commandOptions = {
      start: startFunc,
      stop: stopFunc,
      config: configFunc
    }

    if (commandOptions.hasOwnProperty(args.option)) {
      commandOptions[args.option]()
    } else {
      let embed = new msg.client.errorEmbed("You did not specify a correct command option!\nSee the website for information on this command");
      msg.channel.send(embed)
    }

    async function startFunc() {

      try {
        let sdtdServer = await SdtdServer.findOne({
          discordGuildId: msg.guild.id
        })
        await SdtdServer.update({
          ip: sdtdServer.ip,
          discordGuildId: msg.guild.id
        }, {
          chatChannelId: msg.channel.id
        })
        msg.guild.chatBridge = new ChatBridgeChannel(msg.channel, sdtdServer)
        msg.guild.chatBridge.start()
      } catch (error) {
        sails.log.error(error)
        msg.channel.send(new msg.client.errorEmbed(error))
      }


    }

    async function stopFunc() {
      try {
        let sdtdServer = await SdtdServer.findOne({
          discordGuildId: msg.guild.id
        })
        await SdtdServer.update({
          ip: sdtdServer.ip,
          discordGuildId: msg.guild.id
        }, {
          chatChannelId: 0
        })

        msg.guild.chatBridge.stop() 
        msg.channel.send(new msg.client.customEmbed().setDescription('Stopped chat bridge'))
      } catch (error) {
        sails.log.error(error)
        msg.channel.send(new msg.client.errorEmbed(error))
      }

    }

    function configFunc() {

    }

  }

}


module.exports = ChatBridge;
