const enrichDataObj = require('../../../../worker/processors/logs/enrichEventData');
const LoggingObject = require('../../../../api/hooks/sdtdLogs/LoggingObject');
const { expect } = require('chai');

const LOG_LINES = {
  MEM_UPDATE: {
    'type': 'memUpdate',
    'data': {
      'date': '2020-05-03',
      'time': '03:08:13',
      'uptime': '1272210.587',
      'msg': 'Time: 21202.05m FPS: 27.20 Heap: 1258.3MB Max: 1296.5MB Chunks: 730 CGO: 30 Ply: 1 Zom: 1 Ent: 6 (38) Items: 0 CO: 2 RSS: 2342.8MB',
      'fps': '27.20',
      'heap': '1258.3MB',
      'chunks': '730',
      'zombies': '1',
      'entities': '6',
      'players': '1',
      'items': '0',
      'rss': '2342.8MB'
    },
  },
  LOG_LINE: {
    type: 'logLine',
    data: {
      date: '2020-06-30',
      time: '22:09:11',
      uptime: '14893.982',
      msg: '14806.07 SleeperVolume -672, 79, -848. Spawning at -643, 80, -820, group \'zombieUtilityWorkerGroupGS1\', class zombieUtilityWorker, count 10',
      trace: '',
      type: 'Log'
    },
  },
  CHAT_MESSAGE: {
    'type': 'chatMessage',
    'data': {
      'date': '2020-05-03',
      'time': '03:05:05',
      'uptime': '1272022.950',
      'msg': 'Chat (from \'76561197973697813\', entity id \'171\', to \'Global\'): \'halkeye\': $scare',
      'steamId': '76561197973697813',
      'entityId': '171',
      'channel': 'Global',
      'playerName': 'halkeye',
      'messageText': '$scare'
    },
  }
};

describe('LoggingObject', function () {
  let loggingObject;
  let originalLastLogLine;
  let originalEmptyResponse;
  beforeEach(() => {
    loggingObject = new LoggingObject(sails.testServer);
    loggingObject.lastLogLine = 10;
    originalLastLogLine = loggingObject.lastLogLine;
    originalEmptyResponse = loggingObject.emptyResponses;
    loggingObject.queue = {};
    loggingObject.queue.add = sandbox.stub();
  });
  afterEach(() => {
    loggingObject.destroy();
  });
  describe('handleFailedJob', () => {
    let jobData;
    beforeEach(() => {
      jobData = {
        data: {
          serverId: loggingObject.serverId
        }
      };
      loggingObject.queue.getJob = sandbox.stub().returns(jobData);
    });
    it('ignores bad jobs', async () => {
      delete jobData.data;
      await loggingObject.handleFailedJob('jobId', new Error('The error that happened'));
      expect(loggingObject.lastLogLine).to.equal(originalLastLogLine);
      expect(loggingObject.emptyResponses).to.equal(originalEmptyResponse);
      expect(loggingObject.queue.add).not.to.have.been.called;
    });
    it('ignores messages for other servers', async () => {
      jobData.data.serverId = -1;
      await loggingObject.handleFailedJob('jobId', new Error('The error that happened'));
      expect(loggingObject.lastLogLine).to.equal(originalLastLogLine);
      expect(loggingObject.emptyResponses).to.equal(originalEmptyResponse);
      expect(loggingObject.queue.add).not.to.have.been.called;
    });
    it('handles errors', async () => {
      await loggingObject.handleFailedJob('jobId', new Error('The error that happened'));
      expect(loggingObject.queue.add).to.have.been.called;
      expect(loggingObject.lastLogLine).to.equal(originalLastLogLine);
      expect(loggingObject.emptyResponses).to.equal(originalEmptyResponse);
    });
  });
  describe('handleCompletedJob', () => {
    it('ignores messages for other servers', async () => {
      const job = {};
      const result = {
        serverId: -1
      };
      await loggingObject.handleCompletedJob(job, JSON.stringify(result));
      expect(loggingObject.lastLogLine).to.equal(originalLastLogLine);
      expect(loggingObject.emptyResponses).to.equal(originalEmptyResponse);
      expect(loggingObject.queue.add).not.to.have.been.called;
    });

    it('empty response should increase empty response ', async () => {
      const job = {};
      const result = {
        serverId: sails.testServer.id,
        lastLogLine: originalLastLogLine,
        logs: []
      };
      await loggingObject.handleCompletedJob(job, JSON.stringify(result));
      expect(loggingObject.lastLogLine).to.equal(10);
      expect(loggingObject.emptyResponses).to.equal(1);
      expect(loggingObject.queue.add).to.have.been.called;
    });

    it('fifteenth empty response should reset log last log line and empty response', async () => {
      const job = {};
      const result = {
        serverId: sails.testServer.id,
        lastLogLine: 100,
        logs: []
      };

      for (let i = 1; i < 16; i++) {
        loggingObject.lastLogLine = 100;
        await loggingObject.handleCompletedJob(job, JSON.stringify(result));
        expect(loggingObject.lastLogLine).to.equal(100);
        expect(loggingObject.emptyResponses).to.equal(i);
        expect(loggingObject.queue.add).to.have.been.called;
        loggingObject.queue.add.resetHistory();
      }

      await loggingObject.handleCompletedJob(job, JSON.stringify(result));
      expect(loggingObject.lastLogLine).to.equal(0);
      expect(loggingObject.emptyResponses).to.equal(0);
      expect(loggingObject.queue.add).to.have.been.called;
      loggingObject.queue.add.resetHistory();
    });

    it('Increasing log line number, but not returned rows, it just means its rows we do not care about', async () => {
      const job = {};
      const result = {
        serverId: sails.testServer.id,
        lastLogLine: 100,
        logs: []
      };
      loggingObject.lastLogLine = 100;

      await loggingObject.handleCompletedJob(job, JSON.stringify(result));
      expect(loggingObject.lastLogLine).to.equal(100);
      expect(loggingObject.emptyResponses).to.equal(1);
      expect(loggingObject.queue.add).to.have.been.called;
      loggingObject.queue.add.resetHistory();

      await loggingObject.handleCompletedJob(job, JSON.stringify({ ...result, lastLogLine: 150 }));
      expect(loggingObject.lastLogLine).to.equal(150);
      expect(loggingObject.emptyResponses).to.equal(0);
      expect(loggingObject.queue.add).to.have.been.called;
      loggingObject.queue.add.resetHistory();
    });
    describe('success with various log types', () => {
      it('chatMessage', async () => {
        const job = {};
        const result = {
          serverId: sails.testServer.id,
          lastLogLine: 110,
          logs: [
            {
              ...LOG_LINES.CHAT_MESSAGE,
              server: {
                id: sails.testServer.id
              }
            },
          ]
        };
        const emitSpy = sandbox.spy(loggingObject, 'emit');

        await loggingObject.handleCompletedJob(job, JSON.stringify(result));
        expect(loggingObject.lastLogLine).to.equal(110);
        expect(loggingObject.emptyResponses).to.equal(0);
        expect(loggingObject.failed).to.equal(false);
        expect(loggingObject.slowmode).to.equal(false);
        expect(loggingObject.queue.add).to.have.been.called;
        expect(emitSpy).to.have.been.callCount(2);
        expect(emitSpy).to.have.been.calledWith('logLine', sandbox.match.defined);
        expect(emitSpy).to.have.been.calledWith('chatMessage', sandbox.match.defined);
      });
      it('memUpdate', async () => {
        const job = {};
        const result = {
          serverId: sails.testServer.id,
          lastLogLine: 110,
          logs: [
            {
              ...LOG_LINES.MEM_UPDATE,
              server: {
                id: sails.testServer.id
              }
            },
          ]
        };
        const emitSpy = sandbox.spy(loggingObject, 'emit');

        await loggingObject.handleCompletedJob(job, JSON.stringify(result));
        expect(loggingObject.lastLogLine).to.equal(110);
        expect(loggingObject.emptyResponses).to.equal(0);
        expect(loggingObject.failed).to.equal(false);
        expect(loggingObject.slowmode).to.equal(false);
        expect(loggingObject.queue.add).to.have.been.called;
        expect(emitSpy).to.have.been.callCount(2);
        expect(emitSpy).to.have.been.calledWith('logLine', sandbox.match.defined);
        expect(emitSpy).to.have.been.calledWith('memUpdate', sandbox.match.defined);
      });
      it('logLine', async () => {
        const job = {};
        const result = {
          serverId: sails.testServer.id,
          lastLogLine: 110,
          logs: [
            {
              ...LOG_LINES.LOG_LINE,
              server: {
                id: sails.testServer.id
              }
            },
          ]
        };
        const emitSpy = sandbox.spy(loggingObject, 'emit');

        await loggingObject.handleCompletedJob(job, JSON.stringify(result));
        expect(loggingObject.lastLogLine).to.equal(110);
        expect(loggingObject.emptyResponses).to.equal(0);
        expect(loggingObject.failed).to.equal(false);
        expect(loggingObject.slowmode).to.equal(false);
        expect(loggingObject.queue.add).to.have.been.called;
        expect(emitSpy).to.have.been.callCount(1);
        expect(emitSpy).to.have.been.calledWith('logLine', sandbox.match.defined);
      });
    });

    it('Last success should get updated whenever a job is completed', async () => {
      const job = {};
      const result = {
        serverId: sails.testServer.id,
        lastLogLine: 10,
        logs: [
        ]
      };
      await loggingObject.handleCompletedJob(job, JSON.stringify(result));
      expect(await sails.helpers.redis.get(`sdtdserver:${sails.testServer.id}:sdtdLogs:lastSuccess`)).to.equal(1588296005000);
      expect(loggingObject.lastLogLine).to.equal(10);
      expect(loggingObject.emptyResponses).to.equal(1);
    });

    it('Sets the active flag to true on start', async () => {
      await loggingObject.init();
      expect(loggingObject.active).to.be.true;
    });

    it('Sets the active flag to false on stop', async () => {
      await loggingObject.init();
      await loggingObject.stop();
      expect(loggingObject.active).to.be.false;
    });

    it('Does not add new jobs when active flag is false', async () => {
      await loggingObject.stop();
      expect(loggingObject.active).to.be.false;
      await loggingObject.addFetchJob();
      expect(loggingObject.queue.add).not.to.have.been.called;
    });

    it('Adds new jobs when active flag is true', async () => {
      await loggingObject.init();
      expect(loggingObject.active).to.be.true;
      await loggingObject.addFetchJob();
      expect(loggingObject.queue.add).to.have.been.called;
    });

    it('Adds a job even when enrichData throws', async () => {
      sandbox.stub(enrichDataObj, 'enrichEventData').throws(new Error('Fake throw ;)'));

      const job = {};
      const result = {
        serverId: sails.testServer.id,
        lastLogLine: 10,
        logs: [{ data: { msg: 1 } }, { data: { msg: 2 } }, { data: { msg: 3 } }
        ]
      };
      const events = [];
      loggingObject.on('logLine', _ => events.push(_));
      await loggingObject.handleCompletedJob(job, JSON.stringify(result));

      expect(events).to.have.length(3);
      expect(loggingObject.queue.add).to.have.been.called;

    });
  });
});
