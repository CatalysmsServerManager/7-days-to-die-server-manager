const DiscordNotification = require('../../../../api/hooks/discordNotifications/DiscordNotification.js');
describe('DiscordNotification', function () {
  beforeEach(async function() {
    this.discordChannel = {
      send: sandbox.fake(async () => {})
    };
    this.discordUser = {
      send: sandbox.fake(async () => {})
    };
    this.notification = new DiscordNotification('generic');
    this.notification.getDiscordChannel = () => Promise.resolve(this.discordChannel);
    this.notification.getDiscordUser = () => Promise.resolve(this.discordUser);
    this.notification.makeEmbed = async () => {
      let client = sails.hooks.discordbot.getClient();
      return new client.customEmbed();
    };
  });

  it('Send an empty notification', async function () {
    await this.notification.sendNotification({
      serverId: sails.testServer.id,
      player: sails.testPlayer,
    });
    expect(this.discordChannel.send.callCount).to.equal(1);
    expect(this.discordChannel.send.getCall(0).args.length).to.eql(1);
    expect(this.discordChannel.send.getCall(0).args[0]).to.have.all.keys('author','color','description','fields','file','files','footer','image','thumbnail','timestamp','title','url');
    expect(this.discordChannel.send.getCall(0).args[0].fields).to.eql([]);
  });
  it('Gracefully handle an error', async function () {
    this.discordChannel.send = sandbox.fake(async () => { throw new Error('AHH'); });
    await this.notification.sendNotification({
      serverId: sails.testServer.id,
      player: sails.testPlayer,
    });
    expect(this.discordUser.send.callCount).to.equal(1);
    expect(this.discordUser.send.getCall(0).args.length).to.eql(1);
    expect(this.discordUser.send.getCall(0).args[0]).to.eql('There was an error sending a CSMM notification to your channel and thus the notification has been disabled: `Error: AHH`');
  });
});
