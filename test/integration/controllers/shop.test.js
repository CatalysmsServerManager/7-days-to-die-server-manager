const supertest = require('supertest');
const { expect } = require('chai');

describe('shop', () => {

  describe('post /api/shop/listing', () => {

    beforeEach(() => {
      sandbox.stub(sails.helpers.sdtdApi, 'executeConsoleCommand').resolves({
        command: 'listitems',
        parameters: 'terrDestroyedWoodDebris',
        result: '    some test item\nListed 1 matching items.\n'
      });
    });

    it('returns 200 if correct data', async () => {
      const response = await supertest(sails.hooks.http.mockApp)
        .post('/api/shop/listing')
        .send({
          serverId: sails.testServer.id,
          name: 'some test item',
          amount: '1',
          price: 50
        });

      expect(response.body.name).to.eq('some test item');
      expect(response.statusCode).to.equal(200);

      const record = await ShopListing.findOne({ name: 'some test item' });
      expect(record).to.exist;

    });

    it('returns 400 if incorrect item name is given', async () => {
      const response = await supertest(sails.hooks.http.mockApp)
        .post('/api/shop/listing')
        .send({
          serverId: sails.testServer.id,
          name: 'doesnt exist',
          amount: '1',
          price: 50
        });

      expect(response.statusCode).to.equal(400);
      expect(response.body).to.eq('You have provided an invalid item name.');
    });

    it('returns 400 when setting quality and amount', async () => {
      const response = await supertest(sails.hooks.http.mockApp)
        .post('/api/shop/listing')
        .send({
          serverId: sails.testServer.id,
          name: 'some test item',
          amount: 2,
          quality: 4,
          price: 50
        });

      expect(response.body).to.eq('When setting quality, amount cannot be more than 1');
      expect(response.statusCode).to.equal(400);
    });
  });

  describe('/api/shop/listing/buy', () => {

    beforeEach(async () => {
      await ShopListing.create({
        id: 10,
        price: 50,
        name: 'testListing',
        server: sails.testServer.id
      });
    });

    beforeEach(async () => {
      await Player.update(sails.testPlayer.id, { currency: 50 });
    });

    it('returns 200 if correct data', async () => {
      const response = await supertest(sails.hooks.http.mockApp)
        .post('/api/shop/listing/buy')
        .send({
          playerId: 1,
          listingId: 10,
          amount: '1'
        });

      expect(response.statusCode).to.equal(200);
      expect(response.body.name).to.eq('testListing');
    });

    it('returns 400 when an invalid listing is given', async () => {
      const response = await supertest(sails.hooks.http.mockApp)
        .post('/api/shop/listing/buy')
        .send({
          playerId: 1,
          listingId: 13337,
          amount: '1'
        });

      expect(response.statusCode).to.equal(400);
      expect(response.body).to.deep.eq('Invalid listing ID');
    });

    it('returns 400 when player does not have enough currency', async () => {
      await Player.update(sails.testPlayer.id, { currency: 10 });
      const response = await supertest(sails.hooks.http.mockApp)
        .post('/api/shop/listing/buy')
        .send({
          playerId: 1,
          listingId: 10,
          amount: '1'
        });

      expect(response.statusCode).to.equal(400);
      expect(response.body).to.deep.eq('You do not have enough money to buy this!');
    });

    it('correctly applies economy role modifiers', async () => {
      const createdRole = await Role.create({
        server: sails.testServer.id,
        name: 'shop test',
        level: '2000',
        economyDeductMultiplier: 0.5
      }).fetch();
      await Player.update(sails.testPlayer.id, { currency: 25, role: createdRole.id });
      const response = await supertest(sails.hooks.http.mockApp)
        .post('/api/shop/listing/buy')
        .send({
          playerId: 1,
          listingId: 10,
          amount: '1'
        });

      expect(response.statusCode).to.equal(200);
      expect(response.body.name).to.eq('testListing');
      await Player.update(sails.testPlayer.id, { role: null });
      await Role.destroy(createdRole.id);
    });

  });

});
