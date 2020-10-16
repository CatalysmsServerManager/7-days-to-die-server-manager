const { CustomEmbed } = require('../../../../api/hooks/discordBot/util/createEmbed');
const DiscordNotification = require('../../../../worker/processors/discordNotification/DiscordNotification');

describe('DiscordNotification', function () {
  let spy;
  beforeEach(async function () {
    spy = sandbox.stub(sails.helpers.discord, 'sendMessage').callsFake(() => { });
    this.notification = new DiscordNotification('generic');
    this.notification.makeEmbed = async () => {
      return new CustomEmbed();
    };
  });

  it('Send an empty notification', async function () {
    await this.notification.sendNotification({
      serverId: sails.testServer.id,
      player: sails.testPlayer,
    });

    expect(spy.callCount).to.equal(1);
    expect(spy.getCall(0).args.length).to.eql(3);
    expect(spy.getCall(0).args[2]).to.have.all.keys('author', 'color', 'description', 'fields', 'file', 'files', 'footer', 'image', 'thumbnail', 'timestamp', 'title', 'url');
    expect(spy.getCall(0).args[2].fields).to.eql([]);
  });
  it('Gracefully handle an error', async function () {
    spy.onCall(0).throws(new Error('AHH'));
    await this.notification.sendNotification({
      serverId: sails.testServer.id,
      player: sails.testPlayer,
    });
    expect(spy.callCount).to.equal(1);
    expect(spy.getCall(0).args.length).to.eql(1);
    expect(spy.getCall(0).args[0]).to.eql('There was an error sending a CSMM notification to your channel and thus the notification has been disabled: `Error: AHH`');
  });
});
