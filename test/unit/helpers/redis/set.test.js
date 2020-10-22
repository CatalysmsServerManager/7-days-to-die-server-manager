const { expect } = require('chai');
const redis = require('redis');

describe('REDIS set', () => {

  before(() => {
    this.client = redis.createClient({ url: process.env.REDISSTRING });
  });

  it('Stores a value from Redis', async () => {
    await sails.helpers.redis.set('set-test', 'hello');
    const response = await sails.helpers.redis.get('set-test');
    expect(response).to.be.equal('hello');

  });


  it('Stores a value from Redis with a expiry', async () => {
    await sails.helpers.redis.set('set-test-ex', 'hello', true, 1);
    const response = await sails.helpers.redis.get('set-test-ex');
    expect(response).to.be.equal('hello');
    await wait();
    const responseAfterEx = await sails.helpers.redis.get('set-test-ex');
    expect(responseAfterEx).to.be.equal(null);

  });

});

async function wait() {
  return new Promise((resolve) => {
    setTimeout(resolve, 1000);
  });
}
