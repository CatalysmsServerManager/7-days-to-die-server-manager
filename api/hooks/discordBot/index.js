const Commando = require('discord.js-commando');
const path = require('path');
const handleRoleUpdate = require('./roles/handleRoleUpdate.js');

/**
 * @module DiscordBot
 * @description a Sails project hook. Integrates a discord bot to the system
 * @param {*} sails Global sails instance
 */

/**
 * @module DiscordCommands
 * @description Command guide for users
 */

module.exports = function discordBot(sails) {

  return {

    /**
     * @memberof module:DiscordBot
     * @method
     * @name initialize
     * @description Starts the discord bot & logs in
     */
    initialize: function (cb) {
      sails.on('hook:orm:loaded', function () {
        cb();
        sails.log.info('Initializing custom hook (`discordBot`)');
          client = new Commando.Client({
            owner: sails.config.custom.botOwners,
            unknownCommandResponse: false
          });

          sails.discordBotClient = client;

          // Register custom embed messages

          client.customEmbed = require('./util/createEmbed').CustomEmbed;
          client.errorEmbed = require('./util/createEmbed').ErrorEmbed;

          // Register some stuff in the registry... yeah..
          client.registry
            .registerGroups([
              ['sdtd', '7 Days to die'],
              ['meta', 'Commands about the system']
            ])
            .registerDefaults()
            .registerCommandsIn(path.join(__dirname, 'commands'));

          // Listeners

          client.on('commandError', (command, error) => {
            sails.log.error(`Command error! ${command.memberName} trace: ${error.stack}`);
          });

          client.on('commandRun', (command, promise, message) => {
            sails.log.info(`Command ${command.name} ran by ${message.author.username} on ${message.guild ? message.guild.name : 'DM'} - ${message.content}`);
          });

          client.on('error', error => {
            sails.log.warn('DISCORD ERROR!');
            sails.log.error(error.message);
          });

          client.on('guildMemberUpdate', (oldMember, newMember) => {

            try {
              handleRoleUpdate(oldMember, newMember)
            } catch (error) {
              sails.log.error(`Error handling role change`, error)
            }

          });


          // Login

          client.login(sails.config.custom.botToken).then(() => {
            sails.log.info(`Discord bot logged in - ${client.guilds.size} guilds`);
            initializeGuildPrefixes();


            // Rotate presence with stats info
            client.setInterval(async function () {
              let statsInfo = await sails.helpers.meta.loadSystemStatsAndInfo();
              let randomNumber = Math.trunc(Math.random() * 3);

              let presenceTextToSet = `$info | `

              switch (randomNumber) {
                case 0:
                  presenceTextToSet += `Servers: ${statsInfo.servers}`
                  break;
                  case 1:
                  presenceTextToSet += `Players: ${statsInfo.players}`
                  break;
                  case 2:
                  presenceTextToSet += `Guilds: ${statsInfo.guilds}`
                  break;
                  case 3:
                  presenceTextToSet += `Uptime: ${statsInfo.uptime}`
                  break;
              
                default:
                  break;
              }

              client.user.setPresence({activity: {
                name: presenceTextToSet
              }})
            }, 60000)
         
          })
            .catch((err) => {
              sails.log.error(err);
            });
 
      });
    },

    /**
     * @memberof module:DiscordBot
     * @method
     * @name getClient
     * @description returns the discord client
     */

    getClient: function () {
      return sails.discordBotClient;
    },

    /**
     * @memberof module:DiscordBot
     * @method
     * @name sendNotification
     * @description Sends a notification to servers notification channel
     * @param {string} serverId
     * @param {string} message
     */

    sendNotification: async function (serverId, message) {
      try {
        let server = await SdtdServer.find({ id: serverId }).limit(1);
        let config = await SdtdConfig.find({ id: server.config }).limit(1);
        server = server[0];
        config = config[0];

        if (config.notificationChannelId) {
          let notificationChannel = sails.discordBotClient.channels.get(config.notificationChannelId);
          let embed = new client.customEmbed()
          embed.setDescription(message);
          await notificationChannel.send(embed);
        }

      } catch (error) {
        sails.log.error(`HOOK - discordBot:sendNotification - ${error}`);
      }
    }
  };

};



async function initializeGuildPrefixes() {
  let serversWithDiscordEnabled = await SdtdConfig.find({
    discordGuildId: {
      '!=': ['']
    }
  })

  serversWithDiscordEnabled.forEach(serverConfig => {
    let guild = client.guilds.get(serverConfig.discordGuildId);
    if (guild) {
      guild.commandPrefix = serverConfig.discordPrefix;
    }
  })

}