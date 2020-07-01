const LoggingObject = require('../../../../api/hooks/sdtdLogs/LoggingObject');

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
    loggingObject.addFetchJob = sandbox.stub();
    loggingObject.queue.add = sandbox.stub();
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
    it('ignores messages for other servers', async () => {
      jobData.data.serverId = -1;
      await loggingObject.handleFailedJob('jobId', new Error('The error that happened'));
      expect(loggingObject.lastLogLine).to.equal(originalLastLogLine);
      expect(loggingObject.emptyResponses).to.equal(originalEmptyResponse);
      expect(loggingObject.addFetchJob).not.to.have.been.called;
    });
    it('handles errors', async () => {
      await loggingObject.handleFailedJob('jobId', new Error('The error that happened'));
      expect(loggingObject.addFetchJob).to.have.been.called;
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
      expect(loggingObject.addFetchJob).not.to.have.been.called;
    });

    it('empty response should increase empty response ', async () => {
      const job = {};
      const result = {
        serverId: sails.testServer.id,
        logs: []
      };
      await loggingObject.handleCompletedJob(job, JSON.stringify(result));
      expect(loggingObject.lastLogLine).to.equal(10);
      expect(loggingObject.emptyResponses).to.equal(1);
      expect(loggingObject.addFetchJob).to.have.been.called;
    });

    it('fifth empty response should reset log last log line and empty response', async () => {
      const job = {};
      const result = {
        serverId: sails.testServer.id,
        logs: []
      };
      loggingObject.lastLogLine = 100;
      await loggingObject.handleCompletedJob(job, JSON.stringify(result));
      expect(loggingObject.lastLogLine).to.equal(100);
      expect(loggingObject.emptyResponses).to.equal(1);
      expect(loggingObject.addFetchJob).to.have.been.called;
      loggingObject.addFetchJob.resetHistory();

      await loggingObject.handleCompletedJob(job, JSON.stringify(result));
      expect(loggingObject.lastLogLine).to.equal(100);
      expect(loggingObject.emptyResponses).to.equal(2);
      expect(loggingObject.addFetchJob).to.have.been.called;
      loggingObject.addFetchJob.resetHistory();

      await loggingObject.handleCompletedJob(job, JSON.stringify(result));
      expect(loggingObject.lastLogLine).to.equal(100);
      expect(loggingObject.emptyResponses).to.equal(3);
      expect(loggingObject.addFetchJob).to.have.been.called;
      loggingObject.addFetchJob.resetHistory();

      await loggingObject.handleCompletedJob(job, JSON.stringify(result));
      expect(loggingObject.lastLogLine).to.equal(100);
      expect(loggingObject.emptyResponses).to.equal(4);
      expect(loggingObject.addFetchJob).to.have.been.called;
      loggingObject.addFetchJob.resetHistory();

      await loggingObject.handleCompletedJob(job, JSON.stringify(result));
      expect(loggingObject.lastLogLine).to.equal(100);
      expect(loggingObject.emptyResponses).to.equal(5);
      expect(loggingObject.addFetchJob).to.have.been.called;
      loggingObject.addFetchJob.resetHistory();

      await loggingObject.handleCompletedJob(job, JSON.stringify(result));
      expect(loggingObject.lastLogLine).to.equal(0);
      expect(loggingObject.emptyResponses).to.equal(0);
      expect(loggingObject.addFetchJob).to.have.been.called;
      loggingObject.addFetchJob.resetHistory();
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
        expect(loggingObject.lastLogLine).to.equal(111);
        expect(loggingObject.emptyResponses).to.equal(0);
        expect(loggingObject.failed).to.equal(false);
        expect(loggingObject.slowmode).to.equal(false);
        expect(loggingObject.addFetchJob).to.have.been.called;
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
        expect(loggingObject.lastLogLine).to.equal(111);
        expect(loggingObject.emptyResponses).to.equal(0);
        expect(loggingObject.failed).to.equal(false);
        expect(loggingObject.slowmode).to.equal(false);
        expect(loggingObject.addFetchJob).to.have.been.called;
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
        expect(loggingObject.lastLogLine).to.equal(111);
        expect(loggingObject.emptyResponses).to.equal(0);
        expect(loggingObject.failed).to.equal(false);
        expect(loggingObject.slowmode).to.equal(false);
        expect(loggingObject.addFetchJob).to.have.been.called;
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
      expect(await sails.helpers.redis.get(`sdtdserver:${sails.testServer.id}:sdtdLogs:lastSuccess`)).to.equal('1588296005000');
      expect(loggingObject.lastLogLine).to.equal(10);
      expect(loggingObject.emptyResponses).to.equal(1);
    });
  });
});

