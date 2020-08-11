const { expect } = require('chai');

let hook;
let queue;
let testJob;

describe('Cron hook', () => {

  before(async () => {
    hook = sails.hooks.cron;
    queue = sails.helpers.getQueueObject('cron');
    await queue.pause();
    testJob = await CronJob.create({
      command: 'say "Testerino"',
      temporalValue: '0 * * * *',
      server: sails.testServer.id
    }).fetch();
  });

  beforeEach(async () => {
    // By default, no jobs run in these tests
    await queue.pause();
  });

  afterEach(async () => {
    const statuses = ['completed', 'wait', 'active',
      'delayed', 'failed'];
    for (const status of statuses) {
      await queue.clean(0, status);
    }
  });

  it('Can queue a new job', async () => {
    await hook.start(testJob.id);

    const foundJobs = await queue.getJobs(['delayed', 'active', 'waiting']);
    let testJobFound = foundJobs.find(job => job.data.id === testJob.id);
    expect(testJobFound).to.not.be.undefined;
  });

  it('Clears the repeatable job from the queue when a CronJob is deleted', async () => {
    await hook.start(testJob.id);
    await hook.stop(testJob.id);

    const foundJobs = await queue.getJobs(['delayed', 'active', 'waiting']);

    let testJobFound = foundJobs.find(job => job.data.id === testJob.id);
    expect(testJobFound).to.be.undefined;
  });
});
