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

        if (!notification.enabled) {
            continue;
        }

        if (matches(logLine.msg, notification.stringToSearchFor)) {
            if (notification.ignoreServerChat && isServerMessage(logLine.msg)) {
                sails.log.debug('Ignoring message because server chat is ignored');
            } else {
                sails.log.debug(`Triggered a custom notification for server ${server.id} - ${logLine.msg}`);
                await sendNotification(logLine, server, notification);
            }
        }
    }
}

function matches(msg, test) {
    if (test.startsWith('/') && test.endsWith('/')) {
        return matchesRegex(test, msg);
    } else {
        return matchesString(test, msg);
    }
}

function matchesString(str, msg) {
    return msg.includes(str);
}

function matchesRegex(regex, msg) {
    const rgx = new RegExp(regex.slice(1, regex.length - 1));
    return rgx.test(msg);
}

function isServerMessage(msg) {
    return (msg.startsWith('chat (from \'-non-player-\',') || msg.includes('webcommandresult_for_say'));
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
