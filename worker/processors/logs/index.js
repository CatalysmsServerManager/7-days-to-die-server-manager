const logProcessor = require('./logProcessor');
const enrich = require('./enrichEventData');
const LastLogLine = require('./redisVariables/lastLogLine');
const EmptyResponses = require('./redisVariables/emptyResponses');
const FailedCounter = require('./redisVariables/failedCounter');


async function failedHandler(job, e) {
  // Error getting logs from the server, likely a config error by the user
  sails.log.debug(`Server ${job.data.serverId} has failed! Handling failure logic`);
  // Only log this error if it is not a FetchError
  // If it is a FetchError, we could leak server data
  if (!e.stack.includes('FetchError')) {
    sails.log.error(e);
  }

  await FailedCounter.incr(job.data.serverId);

  const currentFails = await FailedCounter.get(job.data.serverId);
  const lastSuccess = await sails.helpers.redis.get(
    `sdtdserver:${this.serverId}:sdtdLogs:lastSuccess`
  );

  // When this has failed enough times and the server is not in slowmode yet
  // We put the server in slowmode
  if (currentFails > 5 && !job.data.server.config.slowMode) {
    sails.log.debug(`Entering slowmode for server ${job.data.serverId}`);
    // Switch to slow mode
    await SdtdConfig.update({ server: job.data.serverId }, { slowMode: true });
    // First delete the current job
    await sails.helpers.getQueueObject('logs').removeRepeatable({
      jobId: job.data.serverId,
      every: sails.config.custom.logCheckInterval,
    });

    // Then add the job again with slowmode interval
    await sails.helpers.getQueueObject('logs').add({ serverId: job.data.serverId },
      {
        repeat: {
          jobId: job.data.serverId,
          every: sails.config.custom.logCheckIntervalSlowMode,
        }
      });
  }

  // If the server hasnt responded in over three days, we change the status to inactive
  const threeDaysInMs = 1000 * 60 * 60 * 24 * 3;
  if (lastSuccess + threeDaysInMs < Date.now()) {
    sails.log.warn(
      `SdtdLogs - server ${this.serverId} has not responded in over 3 days, setting to inactive`
    );
    // Setting inactive has to happen in the main process, so we just signal that here
    return { setInactive: true };
  }
}

module.exports = async (job) => {
  sails.log.debug('[Worker] Got a `logs` job', job.data);
  job.data.server = await SdtdServer.findOne(job.data.serverId);
  job.data.server.config = await SdtdConfig.findOne({ server: job.data.serverId });
  // Get new log lines from the server
  let resultLogs;
  try {
    resultLogs = await logProcessor(job);
    await sails.helpers.redis.set(
      `sdtdserver:${this.serverId}:sdtdLogs:lastSuccess`,
      Date.now()
    );
    await FailedCounter.set(job.data.serverId, 0);
  } catch (e) {
    const res = await failedHandler(job, e);
    if (res.setInactive) {
      return res;
    }
    // Return an empty array, completion handler expects an array
    return [];
  }

  // At this point, we know the server was connectable
  // So we check if it was in slowmode and if so take it out of slowmode
  if (job.data.server.config.slowMode) {
    // Update the DB record
    await SdtdConfig.update({ server: job.data.serverId }, { slowMode: false });
    // First delete the slowmode job
    await sails.helpers.getQueueObject('logs').removeRepeatable({
      jobId: job.data.serverId,
      every: sails.config.custom.logCheckIntervalSlowMode,
    });

    // Then add the job again with normal interval
    await sails.helpers.getQueueObject('logs').add({ serverId: job.data.serverId },
      {
        repeat: {
          every: sails.config.custom.logCheckInterval,
          jobId: job.data.serverId,
        }
      });
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
  // At this point, we have a bunch of parsed logLines
  for (const newLog of resultLogs.logs) {
    let enrichedLog = newLog;
    if (newLog.type !== 'logLine') {
      try {
        // Add some more data to the log line if possible
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


