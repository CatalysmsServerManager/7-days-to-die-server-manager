const schedule = require('node-schedule')

/**
 * cron hook
 *
 * @description :: A hook definition.  Extends Sails by adding shadow routes, implicit actions, and/or initialization logic.
 * @docs        :: https://sailsjs.com/docs/concepts/extending-sails/hooks
 */

module.exports = function defineCronHook(sails) {

  const scheduledJobs = new Map();

  return {

    /**
     * Runs when a Sails app loads/lifts.
     *
     * @param {Function} done
     */
    initialize: function (done) {
      sails.on('hook:sdtdlogs:loaded', async () => {

        sails.log.info('Initializing custom hook (`cron`)');
        done();
        let activeServers = await SdtdConfig.find({inactive: false});
        let enabledJobs = await CronJob.find({ enabled: true, server: activeServers.map(c => c.server) });

        for (const jobToStart of enabledJobs) {
          try {
            await this.start(jobToStart.id);
          } catch (error) {
            sails.log.error(`Error initializing cronjob ${jobToStart.id} - ${error}`)               
          }
        
        }

        return 
      })

    },

    start: async function (jobId) {

      let foundJob = await CronJob.findOne(jobId);

      if (!foundJob) {
        throw new Error(`Tried to start a job which doesn't exist`);
      }

      let functionToExecute = await sails.helpers.etc.parseCronJob(foundJob.id);

      let scheduledJob = schedule.scheduleJob(foundJob.temporalValue, functionToExecute);

      scheduledJobs.set(foundJob.id, scheduledJob);
      sails.log.debug(`Started a cronjob`, foundJob);
      return
    },

    stop: async function (jobId) {

      let foundJob = await CronJob.findOne(jobId);
      let job = scheduledJobs.get(foundJob.id);

      if (!foundJob || !job) {
        return
      }

      job.cancel();
      scheduledJobs.delete(foundJob.id);
      sails.log.debug(`Stopped a cronjob`, foundJob);
      return

    },

  };



};
