const enrichDataObj = require('../../../../worker/processors/logs/enrichEventData');
const LoggingObject = require('../../../../api/hooks/sdtdLogs/LoggingObject');
const LastLogLine = require('../../../../worker/processors/logs/redisVariables/lastLogLine');
const EmptyResponses = require('../../../../worker/processors/logs/redisVariables/emptyResponses');
const FailedCounter = require('../../../../worker/processors/logs/redisVariables/failedCounter');

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
  });
  afterEach(() => {
    loggingObject.destroy();
  });

  describe('handleCompletedJob', () => {
    it('ignores messages for other servers', async () => {
      const job = {};
      const result = {
        server: { id: -1 }
      };
      const res = await loggingObject.handleCompletedJob(job, JSON.stringify(result));
      expect(loggingObject.lastLogLine).to.equal(originalLastLogLine);
      expect(loggingObject.emptyResponses).to.equal(originalEmptyResponse);
      // Function returns undefined when nothing happened
      expect(res).to.be.equal(undefined);
    });


    describe('success with various log types', () => {
      it('chatMessage', async () => {
        const job = {};
        const result = {
          server: { id: sails.testServer.id },
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
        expect(emitSpy).to.have.been.callCount(1);
        expect(emitSpy).to.have.been.calledWith('chatMessage', sandbox.match.defined);
      });
      it('memUpdate', async () => {
        const job = {};
        const result = {
          server: { id: sails.testServer.id },
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
        expect(emitSpy).to.have.been.callCount(1);
        expect(emitSpy).to.have.been.calledWith('memUpdate', sandbox.match.defined);
      });
      it('logLine', async () => {
        const job = {};
        const result = {
          server: { id: sails.testServer.id },
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
        expect(emitSpy).to.have.been.callCount(1);
        expect(emitSpy).to.have.been.calledWith('logLine', sandbox.match.defined);
      });
    });
  });
});
