const { expect } = require('chai');

const statuses = [
  'completed',
  'wait',
  'active',
  'delayed',
  'failed'
];

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

  it('Can queue a new job', async () => {
    await hook.start(testJob.id);

    const foundJobs = await queue.getJobs(statuses);
    let testJobFound = foundJobs.find(job => job.data.id === testJob.id);
    expect(testJobFound).to.not.be.undefined;
  });

  it('Can queue a new job with the same repeat options', async () => {
    await hook.start(testJob.id);

    const secondJob = await CronJob.create({
      command: 'say "Testerino 2"',
      temporalValue: '0 * * * *',
      server: sails.testServer.id
    }).fetch();

    await hook.start(secondJob.id);

    const foundJobs = await queue.getJobs(statuses);
    let testJobFound = foundJobs.find(job => job.data.id === testJob.id);
    expect(testJobFound).to.not.be.undefined;
    let testSecondJobFound = foundJobs.find(job => job.data.id === secondJob.id);
    expect(testSecondJobFound).to.not.be.undefined;
    expect(foundJobs.length).to.be.eq(2);
  });

  it('Clears the repeatable job from the queue when a CronJob is deleted', async () => {
    await hook.start(testJob.id);

    let foundJobs = await queue.getJobs(statuses);
    let testJobFound = foundJobs.find(job => job.data.id === testJob.id);
    expect(testJobFound).to.not.be.undefined;

    await hook.stop(testJob.id);

    foundJobs = await queue.getJobs(statuses);

    testJobFound = foundJobs.find(job => job.data.id === testJob.id);
    expect(testJobFound).to.be.undefined;
  });
});
