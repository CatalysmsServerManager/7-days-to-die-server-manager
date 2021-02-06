const path = require('path');
const { handleRoleUpdate } = require('./roles/handleRoleUpdate.js');

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
      sails.on('hook:sdtdlogs:loaded', function () {
        sails.log.info('Initializing custom hook (`discordBot`)');
        client = sails.helpers.discord.getClient();

        sails.discordBotClient = client;
        // eslint-disable-next-line callback-return
        cb();

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

        client.on('ready', () => {
          sails.log.info(`Connected to Discord as ${client.user.tag} - ${client.guilds.size} guilds`);
          sails.log.info(`Discord invite link: https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=268749889`);
        });

        client.on('commandRun', (command, promise, message) => {
          sails.log.info(`Command ${command.name} ran by ${message.author.username} on ${message.guild ? message.guild.name : 'DM'} - ${message.content}`);
        });

        client.on('error', error => {
          sails.log.error(`DISCORD ERROR - ${error.message}`);
        });

        client.on('disconnect', e => {
          sails.log.error(`Discord disconnected with code ${e.code} - ${e.reason}`);
        });

        client.on('reconnecting', () => {
          sails.log.warn(`Discord reconnecting to webhook`);
        });

        client.on('warn', (msg) => {
          sails.log.warn(`Discord bot warning: ${msg}`);
        });

        client.on('rateLimit', info => {
          sails.log.warn(`Discord API rateLimit reached! ${info.limit} max requests allowed to ${info.method} ${info.path}`);
        });

        client.on('guildMemberUpdate', (oldMember, newMember) => {
          try {
            handleRoleUpdate(oldMember, newMember);
          } catch (error) {
            sails.log.error(`Error handling role change`, error);
          }

        });


        // Login

        if (process.env.DISCORDBOTTOKEN) {
          client.login(sails.config.custom.botToken).then(() => {
            initializeGuildPrefixes();


            // Rotate presence with stats info
            client.setInterval(async function () {
              let statsInfo = await sails.helpers.meta.loadSystemStatsAndInfo();
              let randomNumber = Math.trunc(Math.random() * 3);

              let presenceTextToSet = `$info | `;

              switch (randomNumber) {
                case 0:
                  presenceTextToSet += `Servers: ${statsInfo.servers}`;
                  break;
                case 1:
                  presenceTextToSet += `Players: ${statsInfo.players}`;
                  break;
                case 2:
                  presenceTextToSet += `Guilds: ${statsInfo.guilds}`;
                  break;
                case 3:
                  presenceTextToSet += `Uptime: ${statsInfo.uptime}`;
                  break;

                default:
                  break;
              }

              client.user.setPresence({
                game: {
                  name: presenceTextToSet
                }
              });
            }, 60000);

          })
            .catch((err) => {
              sails.log.error(err);
            });

        } else {
          sails.log.warn(`No Discord bot token was given, not logging in. This is probably not what you wanted!`);
        }
      });
    },
  };

};



async function initializeGuildPrefixes() {
  let serversWithDiscordEnabled = await SdtdConfig.find({
    discordGuildId: {
      '!=': ['']
    }
  });

  serversWithDiscordEnabled.forEach(serverConfig => {
    let guild = client.guilds.cache.get(serverConfig.discordGuildId);
    if (guild) {
      guild.commandPrefix = serverConfig.discordPrefix;
    }
  });

}
