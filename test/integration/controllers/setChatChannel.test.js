const supertest = require('supertest');
const { expect } = require('chai');

describe('/api/sdtdserver/setchatchannel', function () {

  beforeEach(() => {
    const client = sails.helpers.discord.getClient();
    sandbox.stub(client.channels.cache, 'get').returns({ send: sandbox.stub() });
    sandbox.stub(sails.hooks.discordchatbridge, 'start').returns(null);
    sandbox.stub(sails.hooks.discordchatbridge, 'stop').returns(null);
  });

  it('returns OK with correct data', async function () {
    const client = sails.helpers.discord.getClient();
    sandbox.stub(sails.hooks.discordchatbridge, 'getStatus').returns(false);
    const response = await supertest(sails.hooks.http.mockApp)
      .post('/api/sdtdserver/setchatchannel')
      .send({
        serverId: sails.testServer.id,
        richMessages: true,
        onlyGlobal: true,
        chatChannelId: 'testChannelId'
      });

    expect(response.statusCode).to.equal(200);
    expect(response.body).to.deep.eq({});
    expect(sails.hooks.discordchatbridge.start.calledOnce).to.be.true;
    expect(client.channels.cache.get().send.calledOnce).to.be.true;

  });

  it('returns OK when disabling', async function () {
    sandbox.stub(sails.hooks.discordchatbridge, 'getStatus').returns(true);
    const response = await supertest(sails.hooks.http.mockApp)
      .post('/api/sdtdserver/setchatchannel')
      .send({
        serverId: sails.testServer.id,
        richMessages: true,
        onlyGlobal: true,
        chatChannelId: 0
      });

    expect(response.statusCode).to.equal(200);
    expect(response.body).to.deep.eq({});
    expect(sails.hooks.discordchatbridge.stop.calledOnce).to.be.true;
  });

});


