/**
 * CustomDiscordNotification hook
 *
 * @description :: A hook definition.  Extends Sails by adding shadow routes, implicit actions, and/or initialization logic.
 * @docs        :: https://sailsjs.com/docs/concepts/extending-sails/hooks
 */

const Discord = require('discord.js');

module.exports = function defineCustomDiscordNotificationHook(sails) {

  return {

    /**
     * Runs when a Sails app loads/lifts.
     *
     * @param {Function} done
     */
    initialize: async function (done) {
      sails.log.info('Initializing custom hook (`CustomDiscordNotification`)');
      done();
    },

    async start(serverId) {

      let loggingObject = await sails.hooks.sdtdlogs.getLoggingObject(serverId);

      if (_.isUndefined(loggingObject)) {
        sails.log.warn(`Tried to start custom notifications for a server without a loggingObject`, {
          server: serverId
        });
        return;
      }

      loggingObject.on('logLine', (logLine) => this.handleLogLine(logLine));
    },

    handleLogLine: handleLogLine,
    sendNotification: sendNotification
  };
};


async function handleLogLine(logLine) {

  let server = logLine.server;
  let customNotifs = await CustomDiscordNotification.find({
    server: server.id
  });
  for (const notification of customNotifs) {

    let logMessage = logLine.msg.toLowerCase();
    let stringToSearchFor = notification.stringToSearchFor.toLowerCase();


    if (logMessage.includes(stringToSearchFor) && notification.enabled) {
      if (notification.ignoreServerChat && (logMessage.startsWith('chat (from \'-non-player-\',') || logMessage.includes('webcommandresult_for_say'))) {
        sails.log.debug('Ignoring message because server chat is ignored');
      } else {
        sails.log.debug(`Triggered a custom notification for server ${server.id} - ${logLine.msg}`);
        this.sendNotification(logLine, server, notification);
      }
    }
  }
}

async function sendNotification(logLine, server, customNotif) {

  let discordClient = sails.helpers.discord.getClient();
  let channel = await discordClient.channels.cache.get(customNotif.discordChannelId);

  if (!_.isUndefined(channel)) {
    let embed = new Discord.MessageEmbed();

    embed.setTitle(`Custom notification for ${server.name}`)
      .addField('Time', logLine.time, true)
      .addField('Message', logLine.msg.substr(0, 1024))
      .addField('Triggered by', customNotif.stringToSearchFor);
    return channel.send(embed);
  }


}
