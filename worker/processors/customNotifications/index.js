const Discord = require('discord.js');


module.exports = async function customNotifications(job) {
  sails.log.debug('[Worker] Got a `customNotification` job', {server: job.data.server});
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
    if (!notification.enabled) {
      continue;
    }
    const matchResult = matches(logLine.msg, notification.stringToSearchFor);
    if (matchResult) {
      if (notification.ignoreServerChat && isServerMessage(logLine.msg)) {
        sails.log.debug('Ignoring message because server chat is ignored', {server});
      } else {
        sails.log.info(`Triggered a custom notification for server ${server.id} - ${logLine.msg}`, {server});
        await sendNotification(logLine, server, notification, matchResult);
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
  return msg.toLowerCase().includes(str.toLowerCase());
}

function matchesRegex(regex, msg) {
  const rgx = new RegExp(regex.slice(1, regex.length - 1), 'i');
  const res = msg.match(rgx);
  if (res) {
    if (res.groups) {
      return res.groups;
    }
    return res;
  } else {
    return null;
  }
}

function isServerMessage(msg) {
  return (msg.startsWith('chat (from \'-non-player-\',') || msg.includes('webcommandresult_for_say'));
}

async function sendNotification(logLine, server, customNotif, matches) {

  const discordClient = sails.helpers.discord.getClient();
  const channel = await discordClient.channels.cache.get(customNotif.discordChannelId);

  if (!channel) {
    return;
  }

  const embed = new Discord.MessageEmbed();

  embed.setTitle(`Custom notification for ${server.name}`);

  if (customNotif.message) {
    const message = await sails.helpers.sdtd.fillCustomVariables(
      customNotif.message,
      matches
    );
    embed.setDescription(message);
  } else {
    embed.addField('Message', logLine.msg.substr(0, 1024));
  }

  return channel.send(embed);

}
