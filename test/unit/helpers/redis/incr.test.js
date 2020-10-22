const { expect } = require('chai');
const redis = require('redis');

describe('REDIS incr', () => {

  before(() => {
    this.client = redis.createClient({ url: process.env.REDISSTRING });
  });

  it('Increments a value from Redis', async () => {
    await sails.helpers.redis.set('incr-test', 1);
    await sails.helpers.redis.incr('incr-test');
    const response = await sails.helpers.redis.get('incr-test');
    expect(response).to.be.equal(2);
  });
});

