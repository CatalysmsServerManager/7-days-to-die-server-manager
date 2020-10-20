const { expect } = require('chai');

describe('Redis Pub/Sub', () => {

  beforeEach(() => {
    this.spy = sandbox.spy();
  });

  it('Receives a published message', async () => {
    const subscriber = await sails.helpers.redis.subscribe('test channel');

    const p = new Promise(resolve => subscriber.once('message', resolve));
    await sails.helpers.redis.publish('test channel', 'test message');

    subscriber.on('message', this.spy);

    await p;

    expect(this.spy).to.have.been.calledOnceWith('test channel', JSON.stringify('test message'));


  });

  it('Only receives messages on the correct channel', async () => {
    const subscriber = await sails.helpers.redis.subscribe('test channel');

    const p = new Promise(resolve => subscriber.once('message', resolve));
    await sails.helpers.redis.publish('test channel', 'test message');
    await sails.helpers.redis.publish('other test', 'bad test message');

    subscriber.on('message', this.spy);

    await p;

    expect(this.spy).to.have.been.calledOnceWith('test channel', JSON.stringify('test message'));
    expect(this.spy).to.have.calledOnce;
  });

});
