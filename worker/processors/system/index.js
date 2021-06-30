const donorCheck = require('./donorCheck');
const playerCleanup = require('./playerCleanup');

module.exports = async function system(job) {
  sails.log.debug('[Worker] Got a `system` job');

  switch (job.data.type) {
    case 'donorCheck':
      await donorCheck(job);
      break;
    case 'playerCleanup':
      await playerCleanup(job);
      break;
    default:
      throw new Error(`Unknown system job type "${job.data.type}", discarding`);
  }

};

