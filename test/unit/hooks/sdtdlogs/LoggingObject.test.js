const chai = require("chai");
const sinon = require('sinon')
const expect = chai.expect;

const LoggingObject = require("../../../../api/hooks/sdtdLogs/LoggingObject");

describe("LoggingObject", function () {
  let loggingObject;
  let originalLastLogLine;
  let originalEmptyResponse;
  beforeEach(() => {
    loggingObject = new LoggingObject(
      sails.testServer
    );
    originalLastLogLine = loggingObject.lastLogLine;
    originalEmptyResponse = loggingObject.emptyResponses;
    loggingObject.queue = {
      getJob: sinon.stub(),
      add: sinon.stub()
    }
  });
  describe('handleFailedJob', () => {
    it("does a thing", async () => {
      const job =  {
        data: {
          serverId: loggingObject.serverId
        }
      };
      const result = {};

      loggingObject.queue.getJob = sinon.stub().returns(job);
      loggingObject.addFetchJob = sinon.stub();
      await loggingObject.handleFailedJob("jobId", result);
      expect(loggingObject.addFetchJob).to.have.been.called;
      expect(loggingObject.lastLogLine).to.equal(originalLastLogLine);
      expect(loggingObject.emptyResponses).to.equal(originalEmptyResponse);
    });
  });
  describe('handleCompletedJob', () => {
    it("ignores messages for other servers", async () => {
      const job = {};
      const result = {
        serverId: -1
      };
      await loggingObject.handleCompletedJob(job, JSON.stringify(result));
      expect(loggingObject.lastLogLine).to.equal(originalLastLogLine);
      expect(loggingObject.emptyResponses).to.equal(originalEmptyResponse);
    });

    it("empty response should increase empty response ", async () => {
      const job = {};
      const result = {
        serverId: sails.testServer.id,
        logs: []
      };
      await loggingObject.handleCompletedJob(job, JSON.stringify(result));
      expect(loggingObject.lastLogLine).to.equal(0);
      expect(loggingObject.emptyResponses).to.equal(1);
    });

    it("fifth empty response should reset log last log line and empty response", async () => {
      const job = {};
      const result = {
        serverId: sails.testServer.id,
        logs: []
      };
      loggingObject.lastLogLine = 100;
      await loggingObject.handleCompletedJob(job, JSON.stringify(result));
      expect(loggingObject.lastLogLine).to.equal(100);
      expect(loggingObject.emptyResponses).to.equal(1);

      await loggingObject.handleCompletedJob(job, JSON.stringify(result));
      expect(loggingObject.lastLogLine).to.equal(100);
      expect(loggingObject.emptyResponses).to.equal(2);

      await loggingObject.handleCompletedJob(job, JSON.stringify(result));
      expect(loggingObject.lastLogLine).to.equal(100);
      expect(loggingObject.emptyResponses).to.equal(3);

      await loggingObject.handleCompletedJob(job, JSON.stringify(result));
      expect(loggingObject.lastLogLine).to.equal(100);
      expect(loggingObject.emptyResponses).to.equal(4);

      await loggingObject.handleCompletedJob(job, JSON.stringify(result));
      expect(loggingObject.lastLogLine).to.equal(100);
      expect(loggingObject.emptyResponses).to.equal(5);

      await loggingObject.handleCompletedJob(job, JSON.stringify(result));
      expect(loggingObject.lastLogLine).to.equal(0);
      expect(loggingObject.emptyResponses).to.equal(0);

    });

    it("fifth empty response should reset log last log line and empty response", async () => {
      const job = {};
      const result = {
        serverId: sails.testServer.id,
        lastLogLine: 110,
        logs: [
          {
            "type": "chatMessage",
            "data": {
              "date": "2020-05-03",
              "time": "03:05:05",
              "uptime": "1272022.950",
              "msg": "Chat (from '76561197973697813', entity id '171', to 'Global'): 'halkeye': $scare",
              "steamId": "76561197973697813",
              "entityId": "171",
              "channel": "Global",
              "playerName": "halkeye",
              "messageText": "$scare"
            },
            "server": {
              "id": sails.testServer.id
            }
          },
          {
            "type": "memUpdate",
            "data": {
              "date": "2020-05-03",
              "time": "03:08:13",
              "uptime": "1272210.587",
              "msg": "Time: 21202.05m FPS: 27.20 Heap: 1258.3MB Max: 1296.5MB Chunks: 730 CGO: 30 Ply: 1 Zom: 1 Ent: 6 (38) Items: 0 CO: 2 RSS: 2342.8MB",
              "fps": "27.20",
              "heap": "1258.3MB",
              "chunks": "730",
              "zombies": "1",
              "entities": "6",
              "players": "1",
              "items": "0",
              "rss": "2342.8MB"
            },
            "server": {
              "id": sails.testServer.id
            }
          },
        ]
      };
      await loggingObject.handleCompletedJob(job, JSON.stringify(result));
      expect(loggingObject.lastLogLine).to.equal(110);
      expect(loggingObject.emptyResponses).to.equal(0);
    });
  });
});

