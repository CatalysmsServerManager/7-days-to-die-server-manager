const { expect } = require('chai');
const discordNotification = require('../../../../worker/processors/discordNotification');

describe('discordNotification processor', function () {
  let sendMessage;

  beforeEach(function () {
    sendMessage = sandbox.stub(sails.helpers.discord, 'sendMessage').callsFake(() => { });
  });

  async function setSystembootChannel(channelId) {
    const config = await SdtdConfig.findOne({ server: sails.testServer.id });
    const discordNotificationConfig = { ...config.discordNotificationConfig };
    if (channelId === undefined) {
      delete discordNotificationConfig.systemboot;
    } else {
      discordNotificationConfig.systemboot = channelId;
    }
    await SdtdConfig.update({ server: sails.testServer.id }, { discordNotificationConfig });
  }

  function runJob() {
    return discordNotification({ data: { serverId: sails.testServer.id, notificationType: 'systemboot' } });
  }

  it('sends the notification when a channel is configured', async function () {
    await setSystembootChannel('testChannelId');

    await runJob();

    expect(sendMessage.callCount).to.equal(1);
    expect(sendMessage.getCall(0).args[0]).to.equal('testChannelId');
  });

  it('does not send when the notification is disabled', async function () {
    await setSystembootChannel(undefined);

    await runJob();

    expect(sendMessage.callCount).to.equal(0);
  });
});
