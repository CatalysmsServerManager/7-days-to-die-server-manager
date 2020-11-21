const logProcessor = require('./logProcessor');
const enrich = require('./enrichEventData');
const LastLogLine = require('./redisVariables/lastLogLine');
const EmptyResponses = require('./redisVariables/emptyResponses');

module.exports = async (job) => {
  sails.log.debug('[Worker] Got a `logs` job', job.data);
  job.data.server = await SdtdServer.findOne(job.data.serverId);
  // Get new log lines from the server
  let resultLogs;
  try {
    resultLogs = await logProcessor(job);
  } catch (e) {
    sails.log.error(e);
    // Error getting logs from the server, likely a config error
    // TODO: failed handler check, should start slowmode if needed
    // And set server to inactive if needed

    /*     async setFailedToZero() {
      await sails.helpers.redis.set(
        `sdtdserver:${this.serverId}:sdtdLogs:failedCounter`,
        0
      );
    } */
  }

  /**
   * isStalled check looks at the previous logLine and the current one
   * If these are the same, it means we did not receive any new logs
   * If that happens many times, it might mean our lastLogLine got desynced with that of the server
   * At that point, we reset the lastLogLine and sync with the server again
   */
  const prevLastLogLine = await LastLogLine.get(job.data.serverId);
  const isStalled = resultLogs.lastLogLine === prevLastLogLine;
  if (isStalled) {
    // If the lastLogLine is the same as the previous time we checked,
    // The log is stalled
    await EmptyResponses.incr(job.data.serverId);

    const emptyResponses = await EmptyResponses.get(job.data.serverId);

    // If we dont find any new logs for a while
    // Reset the counter and start from scratch
    if (emptyResponses > 15) {
      sails.log.debug(`Havent received new logs from server ${job.data.serverId} for a while, resetting`);
      await LastLogLine.set(job.data.server.id, 0);
      // Make sure empty responses gets reset so this doesnt continuously fire
      await EmptyResponses.set(job.data.serverId, 0);
    }
  } else {
    // If not stalled, we make sure the empty responses counter is 0
    await EmptyResponses.set(job.data.serverId, 0);
    // And we set the new lastLog value
    await LastLogLine.set(job.data.server.id, resultLogs.lastLogLine);
  }


  const response = [];

  for (const newLog of resultLogs.logs) {
    let enrichedLog = newLog;
    if (newLog.type !== 'logLine') {
      try {
        enrichedLog = await enrich.enrichEventData(newLog);
      } catch (e) {
        sails.log.warn('Error trying to enrich a log line, this should be OK to fail...');
        sails.log.error(e);
      }
      // We still want to emit these events as log lines as well (for modules like hooks, discord notifications)
      response.push(enrichedLog);
    }

    sails.log.debug(
      `Log line for server ${this.serverId} - ${newLog.type} - ${newLog.data.msg}`
    );


    response.push(enrichedLog);
    sails.helpers.getQueueObject('hooks').add(enrichedLog);
  }

  return response;
};


