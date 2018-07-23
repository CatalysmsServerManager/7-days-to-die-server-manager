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

    start(serverId) {

      let loggingObject = sails.hooks.sdtdlogs.getLoggingObject(serverId);

      if (_.isUndefined(loggingObject)) {
        sails.log.warn(`Tried to start custom notifications for a server without a loggingObject`, {
          server: serverId
        });
        return
      }

      loggingObject.on('logLine', async (logLine) => {

        let server = logLine.server;
        let customNotifs = await CustomDiscordNotification.find({
          server: server.id
        });

        for (const notification of customNotifs) {

          let logMessage = logLine.msg.toLowerCase();
          let stringToSearchFor = notification.stringToSearchFor.toLowerCase();

          
          if (logMessage.includes(stringToSearchFor) && notification.enabled ) {
            if (notification.ignoreServerChat && (logMessage.startsWith("chat: 'server':") || logMessage.includes('webcommandresult_for_say')) ) {
              
            } else {
              sendNotification(logLine, server, notification)
            }
          }
        }

      })
    },
  };
};


async function sendNotification(logLine, server, customNotif) {

  let discordClient = sails.hooks.discordbot.getClient();
  let channel = discordClient.channels.get(customNotif.discordChannelId);

  if (!_.isUndefined(channel)) {
    let embed = new Discord.RichEmbed();

    embed.setTitle(`Custom notification for ${server.name}`)
    .addField('Time', logLine.time, true)
    .addField('Uptime', logLine.uptime, true)
    .addField('Message', logLine.msg)
    .addField('Triggered by', customNotif.stringToSearchFor)
    channel.send(embed);
  }


}
