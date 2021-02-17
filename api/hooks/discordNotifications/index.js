module.exports = function SdtdDiscordNotification(sails) {
  return {
    initialize: async function (cb) {
      sails.on('hook:discordbot:loaded', async function () {
        const configs = await SdtdConfig.find({});
        for (const serverConfig of configs) {
          await sails.helpers.discord.sendNotification({
            serverId: serverConfig.server,
            notificationType: 'systemboot'
          });
        }
        cb();
      });
    },
  };
};
