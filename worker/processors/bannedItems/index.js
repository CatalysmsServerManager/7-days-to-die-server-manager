const handleTrackingUpdate = require('./handleTrackingUpdate');

module.exports = async function bannedItems(job) {
  sails.log.debug('[Worker] Got a `bannedItems` job');
  return handleTrackingUpdate(job.data);
};
