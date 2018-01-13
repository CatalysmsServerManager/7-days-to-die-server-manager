const Commando = require('discord.js-commando');
const ChatBridgeChannel = require('./util/chatBridgeChannel.js');
const path = require('path');

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
        sails.on('hook:sdtdlogs:loaded', function () {
          sails.log.debug('HOOK: Initializing discord bot');

          client = new Commando.Client({
            owner: sails.config.custom.botOwners
          });

          sails.discordBotClient = client;

          // Register custom embed messages

          client.customEmbed = require('./util/createEmbed').CustomEmbed;
          client.errorEmbed = require('./util/createEmbed').ErrorEmbed;

          // Register some stuff in the registry... yeah..
          client.registry
            .registerGroups([
              ['7dtd', '7 Days to die']
            ])
            .registerDefaults()
            .registerCommandsIn(path.join(__dirname, 'commands'));

          // Listeners

          client.on('commandError', (command, error) => {
            sails.log.error(`Command error! ${command.memberName} trace: ${error.stack}`);
          });

          client.on('commandRun', (command, promise, message) => {
            sails.log.info(`Command ${command.name} ran by ${message.author.username}`);
          });

          // Login

          client.login(sails.config.custom.botToken).then(() => {
            sails.log.debug('Bot successfully logged in!');
            initChatBridges(client);
            return cb();
          })
            .catch((err) => {
              sails.log.error(err);
            });
        });
      });
    },

    /**
     * @memberof module:DiscordBot
     * @method
     * @name getClient
     * @description returns the discord client
     */

    getClient: function() {
      return sails.discordBotClient;
    }
  };

  async function initChatBridges(client) {
    // Find server that have chatbridge enabled
    let serversWithChatbridges = await SdtdServer.find({
      chatChannelId: {
        '!=': [0]
      }
    });

    // loop over enabled servers and create chatBridge class
    for (let index = 0; index < serversWithChatbridges.length; index++) {
      const element = serversWithChatbridges[index];
      let discordguild = client.guilds.get(element.discordGuildId);
      let textChannel = client.channels.get(element.chatChannelId);
      if (!_.isUndefined(textChannel) && !_.isUndefined(discordguild)) {
        discordguild.chatBridge = new ChatBridgeChannel(textChannel, element);
        discordguild.chatBridge.start();
      }
    }
  }
};
