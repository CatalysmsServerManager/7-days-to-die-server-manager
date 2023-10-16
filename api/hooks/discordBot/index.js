const { handleRoleUpdate } = require('./roles/handleRoleUpdate.js');
const { REST, Routes } = require('discord.js');
const commands = require('./commands');
const adminRestart = require('./util/adminRestart.js');


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
      // eslint-disable-next-line callback-return
      cb();

      sails.after('hook:sdtdLogs:ready', function () {
        sails.log.info('Initializing custom hook (`discordBot`)');
        client = sails.helpers.discord.getClient();

        sails.discordBotClient = client;

        // Register custom embed messages

        client.customEmbed = require('./util/createEmbed').CustomEmbed;
        client.errorEmbed = require('./util/createEmbed').ErrorEmbed;

        // Listeners
        client.on('ready', async () => {
          sails.log.info(`Connected to Discord as ${client.user.tag} - ${client.guilds.size} guilds`);
          sails.log.info(`Discord invite link: https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=268749889`);

          const rest = new REST({ version: '10' }).setToken(
            process.env.DISCORDBOTTOKEN
          );

          try {
            await rest
              .put(Routes.applicationCommands(client.user.id), {
                body: Array.from(commands.values()).map((command) =>
                  command.slashCommand.toJSON()
                ),
              })
              .then(() => sails.log.info("Successfully registered application commands."))
              .catch(sails.log.error);
          } catch (error) {
            sails.log.error(error);
          }



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

        client.rest.on('rateLimited', info => {
          sails.log.warn(`Discord API rateLimit reached! ${info.limit} max requests allowed to ${info.method} ${info.route}`);
        });

        client.on('interactionCreate', async (interaction) => {
          sails.log.info(`Received interaction ${interaction.id}`);
          if (!interaction.isChatInputCommand()) { return; }
          sails.log.info(`Interaction is: ${interaction.commandName}`);

          const command = commands.get(interaction.commandName);
          try {
            await interaction.deferReply();
            await command.handler(interaction, client);
            sails.log.info(`Command ${interaction.commandName} ran by ${interaction.user.username} on ${interaction.guildId}`);
          } catch (error) {
            sails.log.error(`Command error! ${interaction.commandName} trace: ${error.stack}`, error);
            await interaction.editReply(`🔴 something unexpected went wrong while executing this command :( If this problem persists, please join the support server and report this issue.`);
          }
        });

        client.on('guildMemberUpdate', (oldMember, newMember) => {
          try {
            handleRoleUpdate(oldMember, newMember);
          } catch (error) {
            sails.log.error(`Error handling role change`, error);
          }
        });

        client.on('messageCreate', async message => {
          if (message.inGuild()) { return; }
          if (message.author.bot) { return; }

          sails.log.info(`Received DM from ${message.author.username} - ${message.content}`);

          switch (message.content) {
            case 'restart':
              await adminRestart(message);
              break;

            default:
              break;
          }
        });


        // Login

        if (process.env.DISCORDBOTTOKEN) {
          client.login(sails.config.custom.botToken).then(() => {

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
