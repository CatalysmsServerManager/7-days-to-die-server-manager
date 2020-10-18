const { expect } = require('chai');
const GblMaxBans = require('../../../../../worker/processors/discordNotification/notifications/gblMaxBans');

describe('GblMaxBans', function () {
  beforeEach(function () {
    this.spy = sandbox.stub(sails.helpers.discord, 'sendMessage').callsFake(() => { });
    this.notification = new GblMaxBans();
  });

  it('Respond when an error occurred', async function () {
    await this.notification.sendNotification({
      serverId: sails.testServer.id,
      player: {},
      bans: []
    });
    expect(this.spy.callCount).to.equal(1);
    expect(this.spy.getCall(0).args.length).to.eql(3);
    expect(this.spy.getCall(0).args[2]).to.have.all.keys('author', 'color', 'description', 'fields', 'file', 'files', 'footer', 'image', 'thumbnail', 'timestamp', 'title', 'url');

  });
  it('throws when no player supplied', async function () {
    await expect(this.notification.sendNotification({ serverId: sails.testServer.id })).to.eventually.be.rejectedWith('Implementation error! Must provide player info.');
  });

  it('Varies the message depending on if the player was banned or not', async function () {
    await this.notification.sendNotification({
      serverId: sails.testServer.id,
      player: {},
      banned: true,
      bans: []

    });
    expect(this.spy.callCount).to.equal(1);
    expect(this.spy.getCall(0).args.length).to.eql(3);
    expect(this.spy.getCall(0).args[2]).to.have.all.keys('author', 'color', 'description', 'fields', 'file', 'files', 'footer', 'image', 'thumbnail', 'timestamp', 'title', 'url');
    expect(this.spy.getCall(0).lastArg.title).to.match(/A player with \d bans on the GBL was kicked/);

    await this.notification.sendNotification({
      serverId: sails.testServer.id,
      player: {},
      banned: false,
      bans: []

    });
    expect(this.spy.callCount).to.equal(2);
    expect(this.spy.getCall(1).args.length).to.eql(3);
    expect(this.spy.getCall(1).args[2]).to.have.all.keys('author', 'color', 'description', 'fields', 'file', 'files', 'footer', 'image', 'thumbnail', 'timestamp', 'title', 'url');
    expect(this.spy.getCall(1).lastArg.title).to.match(/A player with \d bans on the GBL has connected/);

  });
});
