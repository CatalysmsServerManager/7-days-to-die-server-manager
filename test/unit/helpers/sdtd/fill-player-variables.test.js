const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

const testPlayerData = {
  createdAt: 1543504528705,
  updatedAt: 1543505800149,
  id: 1,
  steamId: '76561198028175941',
  entityId: 171,
  ip: '192.168.13.37',
  country: null,
  currency: 42,
  avatarUrl: 'some-link',
  name: 'Catalysm',
  positionX: -1262,
  positionY: 47,
  positionZ: 1207,
  inventory: null,
  playtime: 61659,
  lastOnline: '2018-11-27T18:04:23Z',
  banned: false,
  deaths: 5,
  zombieKills: 8,
  playerKills: 9,
  score: 1337,
  level: 420,
  lastTeleportTime: '2018-11-29 16:14:17.865',
  server: 1,
  user: 1,
  role: null
};

describe('HELPER sdtd/fill-player-variables', () => {
  it('returns a string', async () => {
    let result = await sails.helpers.sdtd.fillPlayerVariables('test', testPlayerData);

    expect(result).to.be.a('string');

  });

  it('fills correct steamId info', async () => {
    let result = await sails.helpers.sdtd.fillPlayerVariables('sayplayer ${steamId} "Test"', testPlayerData);
    expect(result).to.be.eql('sayplayer 76561198028175941 "Test"');
  });

  it('fills correct entityId info', async () => {
    let result = await sails.helpers.sdtd.fillPlayerVariables('sayplayer ${entityId} "Test"', testPlayerData);
    expect(result).to.be.eql('sayplayer 171 "Test"');
  });

  it('fills correct playerName info', async () => {
    let result = await sails.helpers.sdtd.fillPlayerVariables('sayplayer ${playerName} "Test"', testPlayerData);
    expect(result).to.be.eql('sayplayer Catalysm "Test"');
  });

  it('fills correct balance info', async () => {
    let result = await sails.helpers.sdtd.fillPlayerVariables('sayplayer ${steamId} "Your balance is ${balance}"', testPlayerData);
    expect(result).to.be.eql('sayplayer 76561198028175941 "Your balance is 42"');
  });

  it('fills correct coordinate info', async () => {
    let result = await sails.helpers.sdtd.fillPlayerVariables('sayplayer ${steamId} "Your position is ${posX} ${posY} ${posZ}"', testPlayerData);
    expect(result).to.be.eql('sayplayer 76561198028175941 "Your position is -1262 47 1207"');
  });

  it('errors when invalid player data is provided', () => {
    return expect(sails.helpers.sdtd.fillPlayerVariables('should not resolve', {
      invalidPlayer: true
    })).to.eventually.be.rejectedWith(Error);
  });
});
