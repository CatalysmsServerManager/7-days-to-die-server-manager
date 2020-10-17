const supertest = require('supertest');
const { expect } = require('chai');

beforeEach(async () => {
  sails.testPlayer = await Player.findOne(sails.testPlayer.id).populate('role');
});

describe('/api/player/giveitem', function () {
  it('returns OK with correct data', async function () {
    sandbox.stub(sails.helpers.sdtdApi, 'executeConsoleCommand').callsFake(async () => {
      return {
        result: 'Item given'
      };
    });
    sandbox.stub(sails.helpers.sdtd, 'checkCpmVersion').callsFake(async () => 7);
    const commandInput = {
      playerId: 1,
      itemName: 'someItem',
      amount: '1'
    };

    await supertest(sails.hooks.http.app)
      .post('/api/player/giveitem')
      .send();

    expect(sails.helpers.sdtdApi.executeConsoleCommand).to.have.been.calledWith(sails.testServer.id, `giveplus ${sails.testPlayer.steamId} "${commandInput.itemName}" ${commandInput.amount} ${commandInput.quality ? commandInput.quality + ' 0' : ''}`);

  });

});


