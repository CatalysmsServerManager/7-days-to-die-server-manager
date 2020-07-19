/**
 * cron hook
 *
 * @description :: A hook definition.  Extends Sails by adding shadow routes, implicit actions, and/or initialization logic.
 * @docs        :: https://sailsjs.com/docs/concepts/extending-sails/hooks
 */

module.exports = function defineCronHook(sails) {
  return {

    queue: null,

    initialize: function (done) {
      this.queue = sails.helpers.getQueueObject('cron');
      sails.on('hook:sdtdlogs:loaded', this.ensureJobsAreQueuedOnStart);
      this.queue.process(this.processor);
      return done();
    },

    ensureJobsAreQueuedOnStart: async function () {
      const enabledJobs = await CronJob.find({ enabled: true });
      for (const job of enabledJobs) {
        // We do not need to check if job is already in queue
        // Bull is intelligent enough to not double add jobs with same repeat options
        // As long as we pass the jobId in start() we're fine
        await this.start(job.id);
      }
    },

    start: async function (jobId) {
      const job = await CronJob.findOne(jobId);

      if (!job) {
        throw new Error(`Tried to start a job which doesn't exist`);
      }

      await this.queue.add(job, {
        // Pass JobId here to allow multiple jobs with the same cron
        // https://github.com/OptimalBits/bull/pull/603
        jobId: jobId,
        repeat: {
          cron: job.temporalValue
        },
      });
    },

    stop: async function (jobId) {
      const foundJobs = await this.queue.getJobs(['delayed', 'active', 'waiting']);
      // eslint-disable-next-line eqeqeq
      let foundJob = foundJobs.find(job => job.data.id == jobId);
      if (foundJob) {
        await foundJob.remove();
      } else {
        sails.log.warn(`Tried to remove a job that didn't exist - ${jobId}`);
      }
    },

    processor: async (job) => {
      sails.log.info(`Executing a cron job`, job);
      const functionToExecute = await sails.helpers.etc.parseCronJob(job.data.id);
      return functionToExecute();
    }
  };
};
