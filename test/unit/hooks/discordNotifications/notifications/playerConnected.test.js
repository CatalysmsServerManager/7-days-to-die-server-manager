const expect = require('chai').expect;
const PlayerConnected = require('../../../../../worker/processors/discordNotification/notifications/playerConnected.js');

describe('PlayerConnected', function () {
  beforeEach(function () {
    this.spy = sandbox.stub(sails.helpers.discord, 'sendMessage').callsFake(() => { });

    this.notification = new PlayerConnected();
    this.notification.getDiscordChannel = () => Promise.resolve(this.channel);
  });

  it('Shouldnt try to talk to discord unless all data is available', async function () {
    await this.notification.sendNotification({
      serverId: sails.testServer.id,
    });
    expect(this.spy.callCount).to.equal(0);
  });
  it('HAPPY Path', async function () {
    await this.notification.sendNotification({
      serverId: sails.testServer.id,
      player: sails.testPlayer,
    });
    expect(this.spy.callCount).to.equal(1);
  });
});



