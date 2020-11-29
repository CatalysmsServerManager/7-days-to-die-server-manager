const LastLogLine = require('../../../../worker/processors/logs/redisVariables/lastLogLine');
const EmptyResponses = require('../../../../worker/processors/logs/redisVariables/emptyResponses');
const FailedCounter = require('../../../../worker/processors/logs/redisVariables/failedCounter');
const processor = require('../../../../worker/processors/logs');

const logProcessor = require('../../../../worker/processors/logs/logProcessor');

const { expect } = require('chai');

describe('Worker processor logs', () => {

  beforeEach(async function () {
    sails.helpers.sdtdApi.getWebUIUpdates = sandbox.stub().returns({ newlogs: 2 });
    sails.helpers.sdtdApi.getLog = sandbox.stub().returns({
      entries: [
        {
          date: '2020-07-01',
          time: '23:58:38',
          uptime: '127.041',
          msg: 'Executing command \'say test\' by WebCommandResult_for_say',
          trace: '',
          type: 'Log'
        },
        {
          date: '2020-07-01',
          time: '23:58:38',
          uptime: '127.065',
          msg: 'Chat (from \'-non-player-\', entity id \'-1\', to \'Global\'): \'Server\': test',
          trace: '',
          type: 'Log'
        }
      ],
      lastLine: 5
    });


    await EmptyResponses.set(sails.testServer.id, 0);
    await LastLogLine.set(sails.testServer.id, 0);
  });

  it('empty response should increase empty response', async () => {

    const job = { data: { serverId: sails.testServer.id } };

    await processor(job);
    let lastLogLine = await LastLogLine.get(sails.testServer.id);
    let emptyResponses = await EmptyResponses.get(sails.testServer.id);

    expect(lastLogLine).to.be.equal(5);
    expect(emptyResponses).to.be.equal(0);

    sails.helpers.sdtdApi.getLog.returns({ entries: [] });
    sails.helpers.sdtdApi.getWebUIUpdates.returns({ newlogs: 0 });


    await processor(job);
    lastLogLine = await LastLogLine.get(sails.testServer.id);
    emptyResponses = await EmptyResponses.get(sails.testServer.id);

    expect(lastLogLine).to.be.equal(5);
    expect(emptyResponses).to.be.equal(1);
  });

  it('fifteenth empty response should reset log last log line and empty response', async () => {
    const job = { data: { serverId: sails.testServer.id } };

    sails.helpers.sdtdApi.getLog.returns({ entries: [] });
    sails.helpers.sdtdApi.getWebUIUpdates.returns({ newlogs: 0 });

    // Run it 15 times with empty responses
    for (let i = 0; i < 16; i++) {
      await processor(job);
      lastLogLine = await LastLogLine.get(sails.testServer.id);
      emptyResponses = await EmptyResponses.get(sails.testServer.id);

      expect(lastLogLine).to.be.equal(1);
      expect(emptyResponses).to.be.equal(i);
    }

    // Once more to check the behaviour we want
    await processor(job);
    lastLogLine = await LastLogLine.get(sails.testServer.id);
    emptyResponses = await EmptyResponses.get(sails.testServer.id);

    expect(lastLogLine).to.be.equal(0);
    expect(emptyResponses).to.be.equal(0);

  });

  it('Last success should get updated whenever a job is completed', async () => {
    const job = { data: { serverId: sails.testServer.id } };

    expect(await sails.helpers.redis.get(`sdtdserver:${sails.testServer.id}:sdtdLogs:lastSuccess`)).to.equal(null);
    await processor(job);
    expect(await sails.helpers.redis.get(`sdtdserver:${sails.testServer.id}:sdtdLogs:lastSuccess`)).to.equal(1588296005000);
  });

  it('Sets a server slowmode when it fails a lot', async () => {
    const job = { data: { serverId: sails.testServer.id } };

    sails.helpers.sdtdApi.getLog.rejects(new Error('Oh no bad stuff'));
    sails.helpers.sdtdApi.getWebUIUpdates.rejects(new Error('Oh no bad stuff'));

    let config = await SdtdConfig.findOne({ server: sails.testServer.id });
    expect(config.slowMode).to.be.equal(false);

    // Run it 100 times with failing server
    for (let i = 0; i < 101; i++) {
      await processor(job);
    }

    config = await SdtdConfig.findOne({ server: sails.testServer.id });
    expect(config.slowMode).to.be.equal(true);

  });
  it('Sets a server inactive when it hasnt responded in 3 days', async () => {
    // Last active 4 days ago
    await sails.helpers.redis.set(
      `sdtdserver:${sails.testServer.id}:sdtdLogs:lastSuccess`,
      Date.now() - (1000 * 60 * 60 * 24 * 4)
    );

    const job = { data: { serverId: sails.testServer.id } };

    sails.helpers.sdtdApi.getLog.rejects(new Error('Oh no bad stuff'));
    sails.helpers.sdtdApi.getWebUIUpdates.rejects(new Error('Oh no bad stuff'));

    await SdtdConfig.update({ server: sails.testServer.id }, { slowMode: true });

    const res = await processor(job);
    expect(res).to.have.property('setInactive');
    expect(res.setInactive).to.be.equal(true);
  });


});
