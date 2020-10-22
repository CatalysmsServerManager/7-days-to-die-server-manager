const { expect } = require('chai');
const redis = require('redis');

describe('REDIS get', () => {

  before(() => {
    this.client = redis.createClient({ url: process.env.REDISSTRING });
  });

  it('Retrieves a value from Redis', async () => {
    this.client.set('test', 'hello');

    const response = await sails.helpers.redis.get('test');
    expect(response).to.be.equal('hello');

  });

});
