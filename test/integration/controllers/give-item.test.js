const supertest = require('supertest');
const { expect } = require('chai');

describe('/api/player/giveitem', function () {
  it('returns OK with correct data', async function () {
    sandbox.stub(sails.helpers.sdtdApi, 'executeConsoleCommand').callsFake(async () => {
      return {
        result: 'Item given'
      };
    });
    sandbox.stub(sails.helpers.sdtd, 'checkCpmVersion').callsFake(async () => 7);

    const response = await supertest(sails.hooks.http.app)
      .post('/api/player/giveitem')
      .send({
        playerId: 1,
        itemName: 'something',
        amount: '1'
      });

    expect(response.statusCode).to.equal(200);
    expect(response.body).to.deep.eq({});

  });

});


