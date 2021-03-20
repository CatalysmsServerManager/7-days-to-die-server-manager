const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

describe('HELPER load player stats', () => {

  beforeEach(async () => {
    await Player.create({ ...sails.testPlayer, steamId: '1', id: 4656 });
    const getOnlinePlayersResponse = [
      {
        'steamid': '1',
        'entityid': 171,
        'ip': '192.168.13.37',
        'name': 'Catalysm',
        'online': true,
        'position': { 'x': 1506, 'y': 62, 'z': 173 },
        'experience': -1,
        'level': 18.0453910827637,
        'health': 29,
        'stamina': 72.1149978637695,
        'zombiekills': 378,
        'playerkills': 0,
        'playerdeaths': 19,
        'score': 82,
        'totalplaytime': 116473,
        'lastonline': '2021-03-15T21:14:01',
        'ping': 10
      },
      {
        'steamid': sails.testPlayer.steamId,
        'entityid': sails.testPlayer.entityId,
        'ip': '192.168.13.37',
        'name': sails.testPlayer.name,
        'online': true,
        'position': { 'x': 1506, 'y': 62, 'z': 173 },
        'experience': -1,
        'level': 18.0453910827637,
        'health': 29,
        'stamina': 72.1149978637695,
        'zombiekills': 378,
        'playerkills': 0,
        'playerdeaths': 19,
        'score': 82,
        'totalplaytime': 116473,
        'lastonline': '2021-03-15T21:14:01',
        'ping': 10
      }
    ];
    sandbox.stub(sails.helpers.sdtdApi, 'getOnlinePlayers').resolves(getOnlinePlayersResponse);
  });

  it('returns a list of players', async () => {
    const response = await sails.helpers.sdtd.loadPlayerStats(sails.testServer.id);
    expect(response).to.be.a('array');
    expect(response).to.have.length(2);
    expect(response[0].steamId).to.be.equal('1');
  });

  it('Filters on steam ID', async () => {
    const response = await sails.helpers.sdtd.loadPlayerStats(sails.testServer.id, sails.testPlayer.steamId);
    expect(response).to.be.a('object');
    expect(response.steamId).to.be.equal(sails.testPlayer.steamId);
  });

  it('Updates records in the database', async () => {
    const origPlayer = await Player.findOne(sails.testPlayer.id);
    expect(origPlayer.deaths).to.be.equal(0);
    expect(origPlayer.score).to.be.equal(0);
    expect(origPlayer.level).to.be.equal(0);
    expect(origPlayer.positionX).to.be.equal(0);
    expect(origPlayer.positionY).to.be.equal(0);
    expect(origPlayer.positionZ).to.be.equal(0);
    const response = await sails.helpers.sdtd.loadPlayerStats(sails.testServer.id);
    expect(response).to.be.a('array');
    expect(response).to.have.length(2);
    expect(response[0].steamId).to.be.equal('1');
    const resultPlayer = await Player.findOne(sails.testPlayer.id);
    expect(resultPlayer.deaths).to.be.equal(19);
    expect(resultPlayer.score).to.be.equal(82);
    expect(resultPlayer.level).to.be.equal(18);
    expect(resultPlayer.positionX).to.be.equal(1506);
    expect(resultPlayer.positionY).to.be.equal(62);
    expect(resultPlayer.positionZ).to.be.equal(173);
  });

});
