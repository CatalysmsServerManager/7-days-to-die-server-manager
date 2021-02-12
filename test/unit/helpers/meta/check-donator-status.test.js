const { expect } = require('chai');

describe('HELPER donator status', () => {

  it('Caches the response', async () => {
    const spy = sandbox.stub(sails.helpers.meta, 'getDonatorStatus').resolves('sponsor');

    await sails.helpers.meta.checkDonatorStatus(sails.testServer.id);
    expect(spy).to.have.been.calledOnce;
    await sails.helpers.meta.checkDonatorStatus(sails.testServer.id);
    expect(spy).to.have.been.calledOnce;
  });

});
