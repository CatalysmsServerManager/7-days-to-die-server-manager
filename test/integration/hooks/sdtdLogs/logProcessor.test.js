const expect = require('chai').expect;
const logProcessor = require('../../../../worker/processors/logs/logProcessor');

describe('logProcessor', function () {

  describe('It resets lastLogLine if job.data.lastLogLine is falsey', function () {
    beforeEach(function () {
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

    });

    it('resets lastLogLine if job.data.lastLogLine is 0', async function () {
      const result = await logProcessor({ data: { lastLogLine: 0, server: sails.testServer } });
      expect(sails.helpers.sdtdApi.getWebUIUpdates).to.have.been.callCount(1);
      expect(result.serverId).to.eq(sails.testServer.id);
      expect(result.lastLogLine).to.eq(5);
    });

    it('resets lastLogLine if job.data.lastLogLine is "0"', async function () {
      const result = await logProcessor({ data: { lastLogLine: '0', server: sails.testServer } });
      expect(sails.helpers.sdtdApi.getWebUIUpdates).to.have.been.callCount(1);
      expect(result.serverId).to.eq(sails.testServer.id);
      expect(result.lastLogLine).to.eq(5);
    });
  });

  it('Confirm able to fetch log messages', async function () {
    sandbox.stub(sails.helpers.sdtdApi, 'getWebUIUpdates').callsFake(async function () {
      return {
        newlogs: 1099
      };
    });
    sandbox.stub(sails.helpers.sdtdApi, 'getLog').callsFake(async function () {
      return {
        firstLine: 1100,
        lastLine: 1150,
        entries: [
          {
            date: '2020-05-03',
            time: '03:05:05',
            uptime: '1272022.950',
            msg: 'Chat (from \'76561197973697813\', entity id \'171\', to \'Global\'): \'halkeye\': $scare',
            trace: '',
            type: 'Log',
          },
          {
            date: '2020-05-03',
            time: '03:08:13',
            uptime: '1272210.587',
            msg: 'Time: 21202.05m FPS: 27.20 Heap: 1258.3MB Max: 1296.5MB Chunks: 730 CGO: 30 Ply: 1 Zom: 1 Ent: 6 (38) Items: 0 CO: 2 RSS: 2342.8MB',
            trace: '',
            type: 'Log',
          }
        ],
      };
    });
    const ret = await logProcessor({
      data: {
        server: {
          id: sails.testServer.id
        }
      }
    });

    expect(ret).to.deep.include({
      'serverId': 1,
      'lastLogLine': 1102,
      'logs': [
        {
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
          'server': {
            'id': 1
          }
        },
        {
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
          'server': {
            'id': 1
          }
        }
      ]
    });
  });
});

