/**
 * @module SdtdDiscordNotificationHook
 * @description a Sails project hook. Discord notifications
 * @param {*} sails Global sails instance
 */

module.exports = function SdtdDiscordNotification(sails) {
  return {

    /**
     * @memberof module:SdtdDiscordNotificationHook
     * @method
     * @name initialize
     * @description Initializes the notifications
     */
    initialize: async function (cb) {

      sails.on('hook:discordbot:loaded', async function () {

        let configs = await SdtdConfig.find({});
        for (const serverConfig of configs) {
          await sendNotification({
            serverId: serverConfig.server,
            notificationType: 'systemboot'
          });
        }

        cb();
      });


    },

    sendNotification: sendNotification,
  };

  async function sendNotification(notificationOptions) {
    sails.helpers.getQueueObject('discordNotifications').add(notificationOptions);
  }
};
