const fn = require('../../../worker/util/customFunctions/addCurrency');

describe('CustomFunction addCurrency', function () {
  const instance = new fn();
  let giveStub;
  let deductStub;
  beforeEach(() => {
    giveStub = sandbox.stub(sails.helpers.economy, 'giveToPlayer');
    deductStub = sandbox.stub(sails.helpers.economy, 'deductFromPlayer');
  });

  it('Calls the economy helper', async () => {
    await instance.run(sails.testPlayer.id, 50, sails.testServer.id);
    expect(giveStub).to.have.been.calledOnceWith(sails.testPlayer.id, 50, 'Function call from a custom command - add');
  });

  it('Parses strings to ints', async () => {
    await instance.run(sails.testPlayer.id, '50', sails.testServer.id);
    expect(giveStub).to.have.been.calledOnceWith(sails.testPlayer.id, 50, 'Function call from a custom command - add');

  });
  it('Should work for deducting currency', async () => {
    await instance.run(sails.testPlayer.id, -50, sails.testServer.id);
    expect(deductStub).to.have.been.calledOnceWith(sails.testPlayer.id, 50, 'Function call from a custom command - deduct');
  });
  it('Errors when player not found', async () => {
    await expect(instance.run('notanID', 50, sails.testServer.id)).to.eventually.throw('Unknown player');

  });
  it('', async () => { });

});
