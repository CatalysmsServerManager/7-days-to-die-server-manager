const supertest = require('supertest');
const { expect } = require('chai');

describe('/api/sdtdserver/setnotificationchannel', function () {

  beforeEach(() => {
    const client = sails.helpers.discord.getClient();
    sandbox.stub(client.channels.cache, 'get').callsFake(id => id === '0' ? undefined : { send: sandbox.stub() });
  });

  function setNotificationChannel(notificationChannelId) {
    return supertest(sails.hooks.http.mockApp)
      .post('/api/sdtdserver/setnotificationchannel')
      .send({
        serverId: sails.testServer.id,
        notificationType: 'systemboot',
        notificationChannelId
      });
  }

  it('stores the channel for the notification type', async function () {
    const response = await setNotificationChannel('testChannelId');

    expect(response.statusCode).to.equal(200);
    const config = await SdtdConfig.findOne({ server: sails.testServer.id });
    expect(config.discordNotificationConfig.systemboot).to.equal('testChannelId');
  });

  it('removes the channel when disabling', async function () {
    await setNotificationChannel('testChannelId');

    const response = await setNotificationChannel('0');

    expect(response.statusCode).to.equal(200);
    const config = await SdtdConfig.findOne({ server: sails.testServer.id });
    expect(config.discordNotificationConfig).to.not.have.property('systemboot');
  });

});
