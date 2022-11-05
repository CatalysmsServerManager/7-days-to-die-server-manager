const enrichEventData = require('../../../../api/hooks/sdtdLogs/enrichers');

describe('enrichEventData', () => {

  it('Enriches data when event = playerKilled', async () => {
    const event = {
      type: 'playerKilled',
      victimName: sails.testPlayer.name,
      killerName: sails.testPlayer.name,
      server: sails.testServer
    };

    const result = await enrichEventData(event);
    expect(result.killer.steamId).to.be.equal(sails.testPlayer.steamId);
    expect(result.victim.steamId).to.be.equal(sails.testPlayer.steamId);
  });
  it('Sets the steamId property when 7d2d returns playerID', async () => {
    const event = {
      type: 'any',
      playerID: sails.testPlayer.steamId,
      server: sails.testServer
    };

    const result = await enrichEventData(event);
    expect(result.steamId).to.be.equal(sails.testPlayer.steamId);
    expect(result.player.steamId).to.be.equal(sails.testPlayer.steamId);
  });
  it('Enriches data when event.steamId', async () => {
    const event = {
      type: 'any',
      steamId: sails.testPlayer.steamId,
      server: sails.testServer
    };

    const result = await enrichEventData(event);
    expect(result.steamId).to.be.equal(sails.testPlayer.steamId);
    expect(result.player.steamId).to.be.equal(sails.testPlayer.steamId);
  });
  it('Enriches data when event.steamID', async () => {
    const event = {
      type: 'any',
      steamID: sails.testPlayer.steamId,
      server: sails.testServer
    };

    const result = await enrichEventData(event);
    expect(result.player.steamId).to.be.equal(sails.testPlayer.steamId);
  });

  it('Enriches data when event.crossId', async () => {
    const event = {
      type: 'any',
      crossId: sails.testPlayer.crossId,
      server: sails.testServer
    };

    const result = await enrichEventData(event);
    expect(result.player.crossId).to.be.equal(sails.testPlayer.crossId);
  });

  it('Tries to enrich data via name', async () => {

    const event = {
      type: 'any',
      playerName: sails.testPlayer.name,
      server: sails.testServer
    };

    const result = await enrichEventData(event);
    expect(result.player.steamId).to.be.equal(sails.testPlayer.steamId);
  });

  it('Enriches data with player object when XBL id is in log line', async () => {
    const xblId = `XBL_B80B603151EF84706B1797316A12441B7140692E`;
    await Player.create({
      steamId: xblId,
      name: 'xblPlayer',
      server: sails.testServer.id,
    });

    const event = {
      type: 'any',
      msg: `2022-09-28T23:32:03 19378.063 INF lootRemover: 1, player=${xblId}, item=casinoCoin, qnty=25000, quality=0, used=0`,
    };

    const result = await enrichEventData(event);
    expect(result.player.steamId).to.be.equal(xblId);
  });
});
