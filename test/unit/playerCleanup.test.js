const { expect } = require('chai');
const playerCleanup = require('../../worker/processors/system/playerCleanup');

describe('Player cleanup', () => {

  beforeEach(async () => {
    await SdtdConfig.update({ server: sails.testServer.id }, { playerCleanupLastOnline: 5 });
  });

  it('Clears players that havent been online for a long time', async () => {
    const now = new Date();
    const aWeekAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
    const newPlayer = await Player.update({ id: sails.testPlayer.id }, { lastOnline: aWeekAgo.toISOString() }).fetch();
    await playerCleanup();
    const afterPlayer = await Player.findOne(newPlayer[0].id);
    expect(afterPlayer).to.be.undefined;
  });

  it('Ignores servers that do not have the setting set', async () => {
    const now = new Date();
    const aWeekAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
    const newPlayer = await Player.update({ id: sails.testPlayer.id }, { lastOnline: aWeekAgo.toISOString() }).fetch();
    await SdtdConfig.update({ server: sails.testServer.id }, { playerCleanupLastOnline: null });
    await playerCleanup();
    const afterPlayer = await Player.findOne(newPlayer[0].id);
    expect(afterPlayer).to.be.eqls(newPlayer[0]);
  });


  it('Does not delete recently active players', async () => {
    const now = new Date();
    const aDayAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
    const newPlayer = await Player.update({ id: sails.testPlayer.id }, { lastOnline: aDayAgo.toISOString() }).fetch();
    await playerCleanup();
    const afterPlayer = await Player.findOne(newPlayer[0].id);
    expect(afterPlayer).to.be.eqls(newPlayer[0]);
  });

  // TODO: needs some DB migrations to work properly
  it('Removes aux data (tracking, teleports, ...)', async () => {
    await TrackingInfo.create({ x: 1, y: 2, z: 3, inventory: {}, server: sails.testServer.id, player: sails.testPlayer.id }).fetch();
    await PlayerTeleport.create({ name: 'test', x: 1, y: 2, z: 3, player: sails.testPlayer.id });
    const now = new Date();
    const aWeekAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
    const newPlayer = await Player.update({ id: sails.testPlayer.id }, { lastOnline: aWeekAgo.toISOString() }).fetch();
    await playerCleanup();


    const afterPlayer = await Player.findOne(newPlayer[0].id);
    expect(afterPlayer).to.be.undefined;

    const trackingAfter = await TrackingInfo.find({ player: sails.testPlayer.id });
    expect(trackingAfter).to.have.length(0);

    const teleportsAfter = await PlayerTeleport.find({ player: sails.testPlayer.id });
    expect(teleportsAfter).to.have.length(0);

  });
});
