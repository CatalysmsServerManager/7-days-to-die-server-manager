/**
 * @module SdtdDiscordNotificationHook
 * @description a Sails project hook. Discord notifications
 * @param {*} sails Global sails instance
 */

module.exports = function SdtdDiscordChatBridge(sails) {

  /**
   * @var {Map} discordNotificationInfoMap Keeps track of servers with chatbridges activated
   * @private
   */

  let discordNotificationInfoMap = new Map();

  let loadedNotifications = loadNotifications();

  return {

    /**
     * @memberof module:SdtdDiscordNotificationHook
     * @method
     * @name initialize
     * @description Initializes the notifications
     */
    initialize: async function (cb) {
      sails.on('hook:orm:loaded', async function () {
        sails.on('hook:discordbot:loaded', async function () {

          let configs = await SdtdConfig.find({})

          for (const serverConfig of configs) {
            await sendNotification({
              serverId: serverConfig.server,
              notificationType: 'systemboot'
            })
          }

          cb()
        });

      });
    },

    sendNotification: sendNotification,

    /**
     * @memberof module:SdtdDiscordNotificationHook
     * @method
     * @name start
     * @description Starts the notifications
     */

    start: (notificationType, serverId) => {},

    /**
     * @memberof module:SdtdDiscordNotificationHook
     * @method
     * @name stop
     * @description Stops the notifications
     */

    stop: (notificationType, serverId) => {},

  };

  function loadNotifications() {

    let notifications = new Map();

    const normalizedPath = require('path').join(__dirname, 'notifications');

    require('fs').readdirSync(normalizedPath).forEach(function (file) {
      let notification = require('./notifications/' + file);
      let notificationInstance = new notification();
      notifications.set(notificationInstance.name.toLowerCase(), notificationInstance);
    });

    sails.log.debug(`HOOK - DiscordNotifications - Loaded ${notifications.size} type(s) of notification`)

    return notifications;

  }

  function getNotificationClass(notificationName) {
    return loadedNotifications.get(notificationName.toLowerCase())
  }

  async function sendNotification(notificationOptions) {
    if (!notificationOptions.serverId) {
      throw new Error(`Must specify a serverId in options to send notification`)
    }
    if (!notificationOptions.notificationType) {
      throw new Error(`Must specify a notificationType in options`)
    }
    
    try {
      let serverConfig = await SdtdConfig.findOne({server: notificationOptions.serverId})
        if (serverConfig.discordNotificationConfig[notificationOptions.notificationType]) {
            let notificationClass = getNotificationClass(notificationOptions.notificationType);
            notificationClass.sendNotification(notificationOptions)
        }
    } catch (error) {
        sails.log.error(`HOOK - DiscordNotifications:sendNotification - ${error}`)
    }

  }
}
