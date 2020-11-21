const logProcessor = require('./logProcessor');
const enrich = require('./enrichEventData');

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

  // TODO: isStalled check
  // How to get previous lastLogLine? Distributed/persisted via Redis?
  // Maybe node-cache but if lastLogLine is not distributed, it'll cause errors depending on how many active workers
  // const LastLogLine = require('./lastLogLine');

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


