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
  });

  beforeEach(async () => {
    testJob = await CronJob.create({
      command: 'say "Testerino"',
      temporalValue: '0 * * * *',
      server: sails.testServer.id,
      notificationEnabled: true
    }).fetch();
    // By default, no jobs run in these tests
    await queue.pause();

    sandbox.stub(sails.helpers.sdtdApi, 'getStats').resolves({
      gametime: {
        days: 42,
        hours: 13,
        minutes: 7
      },
      players: 1,
      hostiles: 5,
      animals: 2
    });
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

  it('Sends a notification', () => {
    sandbox.stub(sails.helpers.sdtdApi, 'executeConsoleCommand').callsFake(async () => {
      return {
        result: 'Mock called'
      };
    });
    return new Promise(async (resolve, reject) => {
      await hook.start(testJob.id);

      const foundJobs = await queue.getJobs(statuses);
      const testJobFound = foundJobs.find(job => job.data.id === testJob.id);

      queue.on('global:completed', () => {
        expect(sails.helpers.discord.sendNotification).to.have.been.calledOnce;
        // Have to call resolve like this otherwise the test always succeeds
        resolve();
      });

      queue.on('global:failed', function (job, err) {
        reject(err);
      });

      sandbox.spy(sails.helpers.discord, 'sendNotification');
      await testJobFound.promote();
      await queue.resume();
    });
  });

});
