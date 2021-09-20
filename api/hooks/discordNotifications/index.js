module.exports = function SdtdDiscordNotification(sails) {
  return {
    initialize: async function (cb) {
      // eslint-disable-next-line callback-return
      cb();
      sails.on('hook:discordbot:loaded', async function () {
        const configs = await SdtdConfig.find({});
        for (const serverConfig of configs) {
          await sails.helpers.discord.sendNotification({
            serverId: serverConfig.server,
            notificationType: 'systemboot'
          });
        }
      });
    },
  };
};
