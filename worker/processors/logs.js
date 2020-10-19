const logProcessor = require('../../api/hooks/sdtdLogs/logProcessor');

module.exports = async (job) => {
  sails.log.debug('[Worker] Got a `logs` job', job.data);
  job.data.server = await SdtdServer.findOne(job.data.serverId);
  return logProcessor(job);
};
