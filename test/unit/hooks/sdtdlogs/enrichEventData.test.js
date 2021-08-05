const enrichEventData = require('../../../../api/hooks/sdtdLogs/enrichers');

describe('enrichEventData', () => {

  it('Enriches data when event = playerKilled', async () => {
    const event = {
      type: 'playerKilled',
      data: {
        victimName: sails.testPlayer.name,
        killerName: sails.testPlayer.name
      },
      server: sails.testServer
    };

    const result = await enrichEventData(event);
    expect(result.data.killer.steamId).to.be.equal(sails.testPlayer.steamId);
    expect(result.data.victim.steamId).to.be.equal(sails.testPlayer.steamId);
  });
  it('Sets the steamId property when 7d2d returns playerID', async () => {
    const event = {
      type: 'any',
      data: {
        playerID: sails.testPlayer.steamId,
      },
      server: sails.testServer
    };

    const result = await enrichEventData(event);
    expect(result.data.steamId).to.be.equal(sails.testPlayer.steamId);
    expect(result.data.player.steamId).to.be.equal(sails.testPlayer.steamId);
  });
  it('Enriches data when event.steamId', async () => {
    const event = {
      type: 'any',
      data: {
        steamId: sails.testPlayer.steamId,
      },
      server: sails.testServer
    };

    const result = await enrichEventData(event);
    expect(result.data.steamId).to.be.equal(sails.testPlayer.steamId);
    expect(result.data.player.steamId).to.be.equal(sails.testPlayer.steamId);
  });
  it('Enriches data when event.steamID', async () => {
    const event = {
      type: 'any',
      data: {
        steamID: sails.testPlayer.steamId,
      },
      server: sails.testServer
    };

    const result = await enrichEventData(event);
    expect(result.data.player.steamId).to.be.equal(sails.testPlayer.steamId);
  });
  it('Tries to enrich data via name', async () => {

    const event = {
      type: 'any',
      data: {
        playerName: sails.testPlayer.name,
      },
      server: sails.testServer
    };

    const result = await enrichEventData(event);
    expect(result.data.player.steamId).to.be.equal(sails.testPlayer.steamId);
  });

});
