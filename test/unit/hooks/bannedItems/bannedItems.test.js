const { expect } = require('chai');
const sinon = require('sinon');
const faker = require('faker');

const handleItemTrackerUpdate = require('../../../../worker/processors/bannedItems/handleTrackingUpdate');

describe('HOOK bannedItems', () => {

  beforeEach(async () => {
    this.spy = sandbox.stub(sails.helpers.sdtd, 'executeCustomCmd').resolves(true);
    this.testRoles = [];
    // Create some default roles
    let createdRole = await Role.create({
      server: sails.testServer.id,
      name: 'Admin',
      level: '1',
      manageServer: true
    }).fetch();
    this.testRoles.push(createdRole);

    createdRole = await Role.create({
      server: sails.testServer.id,
      name: 'Player',
      level: '2000',
    }).fetch();
    this.testRoles.push(createdRole);

    await Player.update(sails.testPlayer.id, { role: this.testRoles[0].id });

    this.testPlayer = await Player.create({
      steamId: sails.testUser.steamId + 1,
      server: sails.testServer.id,
      user: sails.testUser.id,
      name: faker.internet.userName(),
      lastTeleportTime: 0,
      role: this.testRoles[1].id
    }).meta({ skipAllLifecycleCallbacks: true }).fetch();

    await BannedItemTier.create({ command: 'say gotcha', role: this.testRoles[0].id, server: sails.testServer.id });
    await BannedItem.create({ name: 'bannedItem', tier: 1, server: sails.testServer.id });
    await SdtdConfig.update(sails.testServerConfig.id, { bannedItemsEnabled: true });
  });


  it('Doesnt do anything when disabled', async () => {
    sandbox.stub(sails.helpers.roles, 'checkPermission').returns({ hasPermission: false });
    await SdtdConfig.update(sails.testServerConfig.id, { bannedItemsEnabled: false });
    const res = await handleItemTrackerUpdate({ server: sails.testServer, trackingInfo: [{ player: this.testPlayer.id, inventory: [{ name: 'bannedItem' }] }] });

    // Checking if nothing happened is weird but not sure how else to test this
    expect(this.spy).not.to.have.been.called;
    expect(res).to.be.equal('bannedItems hook is not enabled');

  });

  it('Executes punishment when a player has a banned item in inventory', async () => {
    sandbox.stub(sails.helpers.roles, 'checkPermission').returns({ hasPermission: false });

    await handleItemTrackerUpdate({ server: sails.testServer, trackingInfo: [{ player: this.testPlayer.id, inventory: [{ name: 'bannedItem' }] }] });
    expect(this.spy).to.have.been.calledOnce;

  });

  it('It respects the global permission exception', async () => {
    sandbox.stub(sails.helpers.roles, 'checkPermission').callsFake(() => { return { hasPermission: true }; });
    await handleItemTrackerUpdate({ server: sails.testServer, trackingInfo: [{ player: this.testPlayer.id, inventory: [{ name: 'bannedItem' }] }] });
    expect(this.spy).not.to.have.been.called;
  });

  it('It respects tiers', async () => {
    sandbox.stub(sails.helpers.roles, 'checkPermission').callsFake(() => { return { hasPermission: false }; });
    await handleItemTrackerUpdate({ server: sails.testServer, trackingInfo: [{ player: sails.testPlayer.id, inventory: [{ name: 'bannedItem' }] }] });
    expect(this.spy).to.not.have.been.called;

    await handleItemTrackerUpdate({ server: sails.testServer, trackingInfo: [{ player: this.testPlayer.id, inventory: [{ name: 'bannedItem' }] }] });
    expect(this.spy).to.have.been.called;
  });

  it('Works when multiple items in inventory', async () => {
    sandbox.stub(sails.helpers.roles, 'checkPermission').callsFake(() => { return { hasPermission: false }; });


    await handleItemTrackerUpdate({ server: sails.testServer, trackingInfo: [{ player: this.testPlayer.id, inventory: [{ name: 'NonBannedItem' }, { name: 'bannedItem' }] }] });
    expect(this.spy).to.have.been.calledOnce;

    await handleItemTrackerUpdate({ server: sails.testServer, trackingInfo: [{ player: this.testPlayer.id, inventory: [{ name: 'bannedItem' }, { name: 'NonBannedItem' }] }] });
    expect(this.spy).to.have.been.calledTwice;

    await handleItemTrackerUpdate({ server: sails.testServer, trackingInfo: [{ player: this.testPlayer.id, inventory: [{ name: 'NonBannedItem' }, { name: 'NonBannedItem' }] }] });
    expect(this.spy).to.have.been.calledTwice;
  });


  it('It processes 2nd player if the 1st player errored', async () => {

    sandbox.stub(sails.helpers.roles, 'checkPermission')
      .onCall(0)
      .throws(new Error('Oh no bad stuff!'))
      .onCall(1)
      .returns({ hasPermission: false });

    await handleItemTrackerUpdate(
      {
        server: sails.testServer,
        trackingInfo:
          [
            { player: 'some random player', inventory: [{ name: 'bannedItem' }] },
            { player: this.testPlayer.id, inventory: [{ name: 'bannedItem' }] }
          ]
      }
    );
    expect(this.spy).to.have.been.calledOnceWith(
      sinon.match.has('id', sails.testServer.id),
      sinon.match.any,
      { player: sinon.match.has('id', this.testPlayer.id), bannedItem: sinon.match.any }
    );
  });

  it('Works for a player with no role set', async () => {
    sandbox.stub(sails.helpers.roles, 'checkPermission').returns({ hasPermission: false });
    const newPlayer = await Player.create({
      steamId: sails.testUser.steamId + 2,
      server: sails.testServer.id,
      user: sails.testUser.id,
      name: faker.internet.userName(),
      lastTeleportTime: 0,
      // No role!
      role: null
    }).meta({ skipAllLifecycleCallbacks: true }).fetch();

    await handleItemTrackerUpdate({ server: sails.testServer, trackingInfo: [{ player: newPlayer.id, inventory: [{ name: 'bannedItem' }] }] });
    expect(this.spy).to.have.been.calledOnce;

  });
});
