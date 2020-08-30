const supertest = require('supertest');

describe('shop', () => {

  describe('/api/shop/listing/buy', () => {

    before(async () => {
      await ShopListing.create({
        id: 1,
        price: 50,
        name: 'testListing',
        server: sails.testServer.id
      });
    });

    beforeEach(async () => {
      await Player.update(sails.testPlayer.id, { currency: 50 });
    });

    it('returns 200 if correct data', async () => {
      const response = await supertest(sails.hooks.http.app)
        .post('/api/shop/listing/buy')
        .send({
          playerId: 1,
          listingId: 1,
          amount: '1'
        });

      expect(response.statusCode).to.equal(200);
      expect(response.body.name).to.eq('testListing');
    });

    it('returns 400 when an invalid listing is given', async () => {
      const response = await supertest(sails.hooks.http.app)
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
      const response = await supertest(sails.hooks.http.app)
        .post('/api/shop/listing/buy')
        .send({
          playerId: 1,
          listingId: 1,
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
      const response = await supertest(sails.hooks.http.app)
        .post('/api/shop/listing/buy')
        .send({
          playerId: 1,
          listingId: 1,
          amount: '1'
        });

      expect(response.statusCode).to.equal(200);
      expect(response.body.name).to.eq('testListing');
    });

  });

});
