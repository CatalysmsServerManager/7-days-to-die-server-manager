const { expect } = require('chai');
const { it } = require('mocha');
const customNotification = require('../../../../worker/processors/customNotifications');

function jobData(msg) {
  return {
    data: {
      data: {
        msg
      },
      server: sails.testServer
    }
  };
}

describe('HOOK Custom Discord notifications', () => {

  beforeEach(async function () {
    this.channelSpy = sandbox.spy();
    sandbox.stub(sails.helpers.discord, 'getClient').returns({
      channels: { cache: { get: () => { return { send: this.channelSpy }; } } }
    });

    await CustomDiscordNotification.create({
      stringToSearchFor: 'unittest',
      ignoreServerChat: true,
      discordChannelId: 'test-channel',
      server: sails.testServer.id
    });

    await CustomDiscordNotification.create({
      stringToSearchFor: '/regex-test/',
      ignoreServerChat: true,
      discordChannelId: 'test-channel',
      server: sails.testServer.id
    });
  });

  it('Detects messages with string matching', async function () {
    await customNotification(jobData('unittest'));
    expect(this.channelSpy).to.have.been.calledOnce;
  });

  it('Correctly handles disabled notifications', async function () {
    await customNotification(jobData('unittest'));
    expect(this.channelSpy).to.have.been.calledOnce;

    await CustomDiscordNotification.update({ stringToSearchFor: 'unittest' }, { enabled: false });
    await customNotification(jobData('unittest'));
    expect(this.channelSpy).to.have.been.calledOnce;
  });

  it('Detects messages with regex matching', async function () {
    await customNotification(jobData('regex-test'));
    expect(this.channelSpy).to.have.been.calledOnce;
  });

  it('Can ignore server chat', async function () {
    await customNotification(jobData('unittest'));
    expect(this.channelSpy).to.have.been.calledOnce;
    await customNotification(jobData('chat (from \'-non-player-\', unittest'));
    expect(this.channelSpy).to.have.been.calledOnce;
  });

});
