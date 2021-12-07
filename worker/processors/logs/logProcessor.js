const handleLogLine = require('./handleLogLine');
const LastLogLine = require('./redisVariables/lastLogLine');


module.exports = async function (job) {
  const resultLogs = [];
  let lastLogLine = await LastLogLine.get(job.data.server.id);

  // If latest log line is not found, get it from the server
  if (!lastLogLine) {
    const webUIUpdate = await sails.helpers.sdtdApi.getWebUIUpdates(SdtdServer.getAPIConfig(job.data.server), null, { timeout: 3000 });
    lastLogLine = parseInt(webUIUpdate.newlogs) + 1;
    sails.log.debug(`lastLogLine not found for server ${job.data.server.id}, fetched current latestLogLine: ${lastLogLine}`, {server: job.data.server});
  }

  // Get new logs from the server
  const newLogs = await sails.helpers.sdtdApi.getLog(SdtdServer.getAPIConfig(job.data.server), lastLogLine, sails.config.custom.logCount, { timeout: 3000 });

  // Adjust latest log line based on new logs we got
  lastLogLine = lastLogLine + newLogs.entries.length;

  await job.update({...job.data, logs: newLogs.entries});

  // Parse these logs into usable data
  let index = -1;
  for (const line of newLogs.entries) {
    index++;
    if (newLogs.entries[index + 1]) {
      if (newLogs.entries[index + 1].msg.includes('handled by mod')) {
        //Message is being handled by a mod, skip to the next line with possibly mod-controlled data
        continue;
      }
    }

    let parsedLogLine = handleLogLine(line);
    if (parsedLogLine) {
      parsedLogLine.server = job.data.server;
      resultLogs.push(parsedLogLine);
    }
  }

  return Promise.resolve({
    serverId: job.data.server.id,
    lastLogLine,
    logs: resultLogs
  });
};
