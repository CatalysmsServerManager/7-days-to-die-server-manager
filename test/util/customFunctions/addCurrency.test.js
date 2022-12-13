const fn = require('../../../worker/util/customFunctions/addCurrency');

describe('CustomFunction addCurrency', function () {
  let giveStub;
  let deductStub;
  let instance;
  beforeEach(() => {
    giveStub = sandbox.stub(sails.helpers.economy, 'giveToPlayer');
    deductStub = sandbox.stub(sails.helpers.economy, 'deductFromPlayer');
    instance = new fn();
  });

  it('Calls the economy helper', async () => {
    await instance.run(sails.testServer, [sails.testPlayer.id, 50].join(','));
    expect(giveStub).to.have.been.calledOnceWith(sails.testPlayer.id, 50, 'Function call from a custom command - add');
  });

  it('Should work for deducting currency', async () => {
    await instance.run(sails.testServer, [sails.testPlayer.id, -50].join(','));
    expect(deductStub).to.have.been.calledOnceWith(sails.testPlayer.id, 50, 'Function call from a custom command - deduct');
  });
  it('Errors when player not found', async () => {
    return expect(instance.run(sails.testServer, [1337, 50].join(','))).to.be.rejectedWith('Unknown player');
  });
  it('Should work for XBL players', async () => {
    const xblPlayer = await Player.create({
      name: 'xblPlayer',
      server: sails.testServer.id,
      steamId: 'XBL_sfasaf23a1sf35as'
    }).fetch();
    await instance.run(sails.testServer, [xblPlayer.steamId, 50].join(','));
    expect(giveStub).to.have.been.calledOnceWith(xblPlayer.id, 50, 'Function call from a custom command - add');
  });
});
