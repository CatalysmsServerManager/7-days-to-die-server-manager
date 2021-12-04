const supertest = require('supertest');
const { expect } = require('chai');

describe('/api/player/giveitem', function () {
  const items = {
    ammo9mmBulletBall: true,
    'item with quotes': true,
  };
  let cpmVersion = 0;

  beforeEach(function() {
    sandbox.stub(sails.helpers.sdtdApi, 'executeConsoleCommand').callsFake(async () => {
      return {
        result: 'Item given'
      };
    });
    sandbox.stub(sails.helpers.sdtd, 'checkCpmVersion').callsFake(async () => cpmVersion);
    sandbox.stub(sails.helpers.sdtd, 'validateItemName').callsFake(async (playerId, itemName) => itemName in items);
  });
  describe('with cpm', function() {
    beforeEach(function() {
      cpmVersion = 7;
    });

    it('returns OK with correct data', async function () {
      const response = await supertest(sails.hooks.http.app)
        .post('/api/player/giveitem')
        .send({
          playerId: 1,
          itemName: 'ammo9mmBulletBall',
          amount: '1'
        });
      expect(response.statusCode).to.equal(200);
      expect(response.body).to.deep.eq({});
      expect(sails.helpers.sdtdApi.executeConsoleCommand).to.have.been.calledWith(
        sandbox.match.any,
        `giveplus ${sails.testPlayer.entityId} "ammo9mmBulletBall" 1 `
      );
    });

    it('Quoted item silently drops the quotes', async function () {
      const response = await supertest(sails.hooks.http.app)
        .post('/api/player/giveitem')
        .send({
          playerId: 1,
          itemName: '"item with quotes"',
          amount: '1'
        });
      expect(response.statusCode).to.equal(200);
      expect(response.body).to.deep.eq({});
      expect(sails.helpers.sdtdApi.executeConsoleCommand).to.have.been.calledWith(
        sandbox.match.any,
        `giveplus ${sails.testPlayer.entityId} "item with quotes" 1 `
      );
    });

    it('returns 400 if incorrect item name is given', async () => {
      const response = await supertest(sails.hooks.http.app)
        .post('/api/player/giveitem')
        .send({
          playerId: 1,
          itemName: 'doesnt exist',
          amount: '1'
        });
      expect(response.statusCode).to.equal(400);
      expect(response.body).to.eq('You have provided an invalid item name.');
      expect(sails.helpers.sdtdApi.executeConsoleCommand).not.to.have.been.called;
    });
  });
  describe('without cpm', function() {
    beforeEach(function() {
      cpmVersion = 0;
    });

    it('returns OK with correct data', async function () {
      const response = await supertest(sails.hooks.http.app)
        .post('/api/player/giveitem')
        .send({
          playerId: 1,
          itemName: 'ammo9mmBulletBall',
          amount: '1'
        });
      expect(response.statusCode).to.equal(200);
      expect(response.body).to.deep.eq({});
      expect(sails.helpers.sdtdApi.executeConsoleCommand).to.have.been.calledWith(
        sandbox.match.any,
        `give ${sails.testPlayer.entityId} "ammo9mmBulletBall" 1 `
      );
    });

    it('Quoted item silently drops the quotes', async function () {
      const response = await supertest(sails.hooks.http.app)
        .post('/api/player/giveitem')
        .send({
          playerId: 1,
          itemName: '"item with quotes"',
          amount: '1'
        });
      expect(response.statusCode).to.equal(200);
      expect(response.body).to.deep.eq({});
      expect(sails.helpers.sdtdApi.executeConsoleCommand).to.have.been.calledWith(
        sandbox.match.any,
        `give ${sails.testPlayer.entityId} "item with quotes" 1 `
      );
    });


    it('returns 400 if incorrect item name is given', async () => {
      const response = await supertest(sails.hooks.http.app)
        .post('/api/player/giveitem')
        .send({
          playerId: 1,
          itemName: 'doesnt exist',
          amount: '1'
        });
      expect(response.statusCode).to.equal(400);
      expect(response.body).to.eq('You have provided an invalid item name.');
      expect(sails.helpers.sdtdApi.executeConsoleCommand).not.to.have.been.called;
    });
  });
});


