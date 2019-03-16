const ChatBridgeChannel = require('./chatBridgeChannel.js');

/**
 * @module SdtdDiscordChatBridgeHook
 * @description a Sails project hook. Discord chat bridges
 * @param {*} sails Global sails instance
 */

module.exports = function SdtdDiscordChatBridge(sails) {

  /**
   * @var {Map} chatBridgeInfoMap Keeps track of servers with chatbridges activated
   * @private
   */

  let chatBridgeInfoMap = new Map();

  return {

    /**
     * @memberof module:SdtdDiscordChatBridgeHook
     * @method
     * @name initialize
     * @description Initializes the chatbridges(s)
     */
    initialize: async function (cb) {
      sails.on('hook:discordbot:loaded', async function () {
        sails.log.info('Initializing custom hook (`discordChatbridge`)');

        let discordClient = sails.hooks.discordbot.getClient();

        discordClient.on('ready', async () => {
          try {
            let enabledServers = await SdtdConfig.find({
              inactive: false,
              or: [{
                chatChannelId: {
                  '!=': ''
                }
              }]
            });

            for (const serverConfig of enabledServers) {
              try {
                await start(serverConfig.server);
              } catch (error) {
                sails.log.error(`HOOK - DiscordChatBridge:initialize - Error for server ${serverConfig.server} - ${error}`)
              }
            }
            sails.log.info(`HOOK SdtdDiscordChatBridge:initialize - Initialized ${chatBridgeInfoMap.size} chatbridge(s)`);


          } catch (error) {
            sails.log.error(`HOOK SdtdDiscordChatBridge:initialize - ${error}`);
          }
        });

        return cb();

      });

    },

    /**
     * @memberof module:SdtdDiscordChatBridgeHook
     * @method
     * @name start
     * @description Starts the chat bridge(s)
     */

    start: start,

    /**
     * @memberof module:SdtdDiscordChatBridgeHook
     * @method
     * @name stop
     * @description Stops the chat bridge(s)
     */

    stop: stop,

    /**
     * @memberof module:SdtdDiscordChatBridgeHook
     * @method
     * @name getStatus
     * @description Get the chat bridge status for a server
     * @returns {boolean}
     */

    getStatus: function (serverId) {
      return chatBridgeInfoMap.has(String(serverId));
    },

    getAmount: function () {
      return chatBridgeInfoMap.size
    }

  };

  async function start(serverId) {

    try {
      sails.log.debug(`HOOK SdtdDiscordChatBridge:start - Starting chatbridge for server ${serverId}`);
      let discordClient = sails.hooks.discordbot.getClient();
      let config = await SdtdConfig.find({
        server: serverId
      }).limit(1);

      config = config[0]

      if (_.isUndefined(config) || !config.chatChannelId) {
        throw new Error(`Tried to start chatbridge for server without config`);
      }

      if (config.chatChannelId === 0) {
        return;
      }

      let server = await SdtdServer.findOne(serverId);
      let textChannel = discordClient.channels.get(config.chatChannelId);

      if (_.isUndefined(server)) {
        throw new Error(`Unknown server`);
      }

      if (_.isUndefined(textChannel)) {
        return;
      }

      let oldChat = getChatBridge(serverId);

      if (oldChat) {
        await stop(serverId);
      }

      let chatBridge = new ChatBridgeChannel(textChannel, server);
      setChatBridge(serverId, chatBridge)
      return;
    } catch (error) {
      sails.log.error(`HOOK SdtdDiscordChatBridge:start - ${error}`);
      throw error;
    }
  }

  async function stop(serverId) {
    try {
      sails.log.debug(`HOOK SdtdDiscordChatBridge:stop - Stopping chatbridge for server ${serverId}`);
      let chatBridge = getChatBridge(serverId)
      if (!_.isUndefined(chatBridge)) {
        chatBridge.stop();
        return chatBridgeInfoMap.delete(String(serverId));
      }
      return;
    } catch (error) {
      sails.log.error(`HOOK SdtdDiscordChatBridge:stop - ${error}`);
      throw error;
    }
  }

  function getChatBridge(serverId) {
    return chatBridgeInfoMap.get(String(serverId))
  }

  function setChatBridge(serverId, chatBridgeObj) {
    return chatBridgeInfoMap.set(String(serverId), chatBridgeObj)
  }
};
