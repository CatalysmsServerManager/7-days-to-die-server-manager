const { expect } = require('chai');
const sinon = require('sinon');

const handleItemTrackerUpdate = require('../../../../worker/processors/bannedItems/handleTrackingUpdate');

describe('HOOK bannedItems', () => {

  beforeEach(async () => {
    this.spy = sandbox.stub(sails.helpers.sdtd, 'executeCustomCmd').resolves(true);
    await SdtdConfig.update(sails.testServerConfig.id, { bannedItems: ['bannedItem'] });
    await SdtdConfig.update(sails.testServerConfig.id, { bannedItemsEnabled: true });
  });


  it('Doesnt do anything when disabled', async () => {
    sandbox.stub(sails.helpers.roles, 'checkPermission').returns({ hasPermission: false });
    await SdtdConfig.update(sails.testServerConfig.id, { bannedItemsEnabled: false });
    const res = await handleItemTrackerUpdate({ server: sails.testServer, trackingInfo: [{ player: sails.testPlayer.id, inventory: [{ name: 'bannedItem' }] }] });

    // Checking if nothing happened is weird but not sure how else to test this
    expect(this.spy).not.to.have.been.called;
    expect(res).to.be.equal('bannedItems hook is not enabled');

  });

  it('Executes punishment when a player has a banned item in inventory', async () => {
    sandbox.stub(sails.helpers.roles, 'checkPermission').returns({ hasPermission: false });

    await handleItemTrackerUpdate({ server: sails.testServer, trackingInfo: [{ player: sails.testPlayer.id, inventory: [{ name: 'bannedItem' }] }] });
    expect(this.spy).to.have.been.calledOnce;

  });

  it('It respects the permission exception', async () => {
    sandbox.stub(sails.helpers.roles, 'checkPermission').callsFake(() => { return { hasPermission: true }; });
    await handleItemTrackerUpdate({ server: sails.testServer, trackingInfo: [{ player: sails.testPlayer.id, inventory: [{ name: 'bannedItem' }] }] });
    expect(this.spy).not.to.have.been.called;

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
            { player: sails.testPlayer.id, inventory: [{ name: 'bannedItem' }] }
          ]
      }
    );
    expect(this.spy).to.have.been.calledOnceWith(
      sinon.match.has('id', sails.testServer.id),
      sinon.match.any,
      { player: sinon.match.has('id', sails.testPlayer.id) }
    );
  });
});
