const { expect } = require('chai');

describe('Redis Pub/Sub', () => {

  beforeEach(() => {
    this.spy = sandbox.spy();
  });

  it('Receives a published message', async () => {
    const subscriber = await sails.helpers.redis.subscribe('test channel');

    await sails.helpers.redis.publish('test channel', 'test message');

    subscriber.on('message', this.spy);
    await wait();

    expect(this.spy).to.have.been.calledOnceWith('test channel', 'test message');


  });

  it('Only receives messages on the correct channel', async () => {
    const subscriber = await sails.helpers.redis.subscribe('test channel');

    await sails.helpers.redis.publish('test channel', 'test message');
    await sails.helpers.redis.publish('other test', 'bad test message');

    subscriber.on('message', this.spy);
    await wait();

    expect(this.spy).to.have.been.calledOnceWith('test channel', 'test message');
    expect(this.spy).to.have.calledOnce;
  });

});

// TODO: Get rid of this wait thing and use Promise resolving
// Not sure how to do it atm
async function wait() {
  return new Promise((resolve) => {
    setTimeout(resolve, 250);
  });
}
