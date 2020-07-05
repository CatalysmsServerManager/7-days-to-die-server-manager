const expect = require('chai').expect;
const PlayerConnected = require('../../../../../api/hooks/discordNotifications/notifications/playerConnected.js');

describe('PlayerConnected', function () {
  beforeEach(function() {
    this.channel = {
      send: sandbox.fake()
    };

    this.notification = new PlayerConnected();
    this.notification.getDiscordChannel = () => Promise.resolve(this.channel);
  });

  it('Shouldnt try to talk to discord unless all data is available', async function () {
    await this.notification.sendNotification({
      serverId: sails.testServer.id,
    });
    expect(this.channel.send.callCount).to.equal(0);
  });
  it('HAPPY Path', async function () {
    await this.notification.sendNotification({
      serverId: sails.testServer.id,
      player: sails.testPlayer,
    });
    expect(this.channel.send.callCount).to.equal(1);
    // expect(this.channel.send.getCall(0).args).to.equal([{}]); // DISABLED cause all the data is random
    expect(true).to.equal(true);
  });
});



