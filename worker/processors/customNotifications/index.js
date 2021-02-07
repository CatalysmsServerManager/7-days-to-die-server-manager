const Discord = require('discord.js');


module.exports = async (job) => {
    sails.log.debug('[Worker] Got a `customNotification` job', job.data);
    if (!job.data.data.msg) {
        throw new Error(`Must specify a msg`);
    }

    if (!job.data.server) {
        throw new Error(`Must specify a server in logLine`);
    }

    return handleLogLine(job.data);
};


async function handleLogLine(logLine) {
    let server = logLine.server;
    logLine = logLine.data;
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
                await sendNotification(logLine, server, notification);
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
