const { expect } = require('chai');

describe('baddd', () => {
  it('fails', () => {
    expect(true).to.be.false;
  });
});

describe('countryBan', () => {

  beforeEach(() => {
    sandbox.stub(sails.helpers.sdtdApi, 'executeConsoleCommand').callsFake();
  });

  it('Kicks a player that connects from a banned country', async () => {
    const connectedMessage = {
      steamId: '76561198028175941',
      playerName: 'Catalysm',
      entityId: '171',
      ip: '192.168.1.1',
      date: '2020-07-15',
      time: '22:40:53',
      uptime: '569.373',
      msg: 'Player connected, entityid=171, name=Catalysm, steamid=76561198028175941, steamOwner=76561198028175941, ip=192.168.1.1',
      country: 'BE',
      player: {
        createdAt: 1591719367715,
        updatedAt: 1594845653806,
        id: 27,
        steamId: '76561198028175941',
        entityId: 171,
        ip: '192.168.1.1',
        country: null,
        currency: 0,
        avatarUrl: '',
        name: 'Catalysm',
        positionX: -1279,
        positionY: 61,
        positionZ: 209,
        inventory: {
          steamid: '76561198028175941',
          entityid: 171,
          bag: [Array],
          belt: [Array],
          equipment: [Object]
        },
        playtime: 70,
        lastOnline: '2020-07-15T20:36:01Z',
        banned: false,
        deaths: 0,
        zombieKills: 0,
        playerKills: 0,
        score: 0,
        level: 1,
        lastTeleportTime: '2020-06-09 18:14:59.737',
        server: 1,
        user: 3,
        role: 9
      },
      server: sails.testServer,
      type: 'playerConnected'
    };
    const handleCountryBan = sails.hooks.countryban.handleCountryBan;
    const notifSpy = sandbox.spy(sails.hooks.discordnotifications, 'sendNotification');

    await handleCountryBan(connectedMessage);

    expect(notifSpy).to.have.been.calledOnce;

  });

});
