const handleTrackingUpdate = require('./handleTrackingUpdate');

module.exports = async (job) => {
  sails.log.debug('[Worker] Got a `bannedItems` job', job.data);
  return handleTrackingUpdate(job.data);
};
