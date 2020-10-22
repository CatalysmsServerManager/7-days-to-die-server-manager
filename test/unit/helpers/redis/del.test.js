const { expect } = require('chai');
const redis = require('redis');

describe('REDIS del', () => {

  before(() => {
    this.client = redis.createClient({ url: process.env.REDISSTRING });
  });

  it('Deletes a value from Redis', async () => {
    await sails.helpers.redis.set('del-test', 'hello');
    const response = await sails.helpers.redis.get('del-test');
    expect(response).to.be.equal('hello');
    await sails.helpers.redis.del('del-test');
    const responseAfterDel = await sails.helpers.redis.get('del-test');

    expect(responseAfterDel).to.be.equal(null);

  });


});

