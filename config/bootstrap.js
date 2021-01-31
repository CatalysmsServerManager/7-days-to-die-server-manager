const SdtdApi = require('7daystodie-api-wrapper');
/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs just before your Sails app gets lifted.
 * > Need more flexibility?  You can also do this by creating a hook.
 *
 * For more information on bootstrapping your app, check out:
 * https://sailsjs.com/config/bootstrap
 */

module.exports.bootstrap = async function (done) {
  sails.helpers.sdtdApi = {};
  for (const func of Object.keys(SdtdApi)) {
    sails.helpers.sdtdApi[func] = SdtdApi[func];
  }

  if (process.env.IS_TEST) {
    sails.cache = new Object();
    return done();
  }

  await sails.helpers.meta.startUsageStatsGathering();
  sails.log.info(`Started the system stats gathering interval`);
  if (!process.env.REDISSTRING) {
    sails.log.warn(`Not using redis as cache. Defaulting to in-memory caching. Be aware that this is not ideal for production environments!`);
    sails.cache = new Object();
  }

  const queue = await sails.helpers.getQueueObject('system');
  await queue.add({ type: 'donorCheck' },
    {
      attempts: 1,
      repeat: {
        cron: '0 0 * * *',
      }
    });

  setInterval(async () => {
    await sails.helpers.meta.fixDuplicatePlayers();
  }, 360000);


  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
  return done();

};
