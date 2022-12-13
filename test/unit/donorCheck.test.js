const donorCheck = require('../../worker/processors/system/donorCheck');

describe('donor check', () => {

  before(() => {
    this.originalDonorTier = process.env.CSMM_DONATOR_TIER;
    process.env.CSMM_DONATOR_TIER = undefined;
  });

  after(() => {
    process.env.CSMM_DONATOR_TIER = this.originalDonorTier;

  });

  beforeEach(async () => {
    this.dmSpy = sandbox.stub(sails.helpers.discord, 'sendDm').resolves(true);
    process.env.CSMM_DONOR_ONLY = true;
  });

  it('Marks servers that are not donor for deletion', async () => {
    sandbox.stub(sails.helpers.meta, 'checkDonatorStatus').resolves('free');
    let current = await SdtdConfig.findOne({ server: sails.testServer.id });
    expect(current.failedDonorChecks).to.be.equal(0);
    await donorCheck();
    current = await SdtdConfig.findOne({ server: sails.testServer.id });
    expect(current.failedDonorChecks).to.be.equal(1);
  });
  it('Deletes a server after 7 failed checks', async () => {
    sandbox.stub(sails.helpers.meta, 'checkDonatorStatus').resolves('free');
    for (let i = 1; i < 8; i++) {
      let current = await SdtdConfig.findOne({ server: sails.testServer.id });
      expect(current.failedDonorChecks).to.be.equal(i - 1);
      await donorCheck();
    }

    const server = await SdtdServer.findOne({ name: 'Freeloader server' });
    expect(server).to.be.equal(undefined);

  });
  it('Sends a notification to the owner whenever a check fails', async () => {
    sandbox.stub(sails.helpers.meta, 'checkDonatorStatus').resolves('free');
    await donorCheck();
    expect(this.dmSpy).to.have.been.calledOnceWith(sails.testUser.discordId);
  });
  it('Resets counter if a server becomes a paid server', async () => {
    sandbox.stub(sails.helpers.meta, 'checkDonatorStatus')
      .resolves('free')
      .onCall(4)
      .resolves('sponsor');

    for (let i = 1; i < 6; i++) {
      const current = await SdtdConfig.findOne({ server: sails.testServer.id });
      expect(current.failedDonorChecks).to.be.equal(i - 1);
      await donorCheck();
    }

    const current = await SdtdConfig.findOne({ server: sails.testServer.id });
    expect(current.failedDonorChecks).to.be.equal(0);
  });

  it('Does not handle servers already marked as disabled', async () => {
    sandbox.stub(sails.helpers.meta, 'checkDonatorStatus').resolves('free');
    await SdtdServer.update({ id: sails.testServer.id }, { disabled: true });
    await donorCheck();
    const current = await SdtdConfig.findOne({ server: sails.testServer.id });
    expect(current.failedDonorChecks).to.be.equal(0);
  });

});
