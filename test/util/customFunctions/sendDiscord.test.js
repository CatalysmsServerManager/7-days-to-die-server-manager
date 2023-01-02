const { expect } = require('chai');
const fn = require('../../../worker/util/customFunctions/sendDiscord');

describe('CustomFunction sendDiscord', function () {
  let instance;
  let stub;
  let guildStub;
  beforeEach(async () => {
    instance = new fn();
    stub = sandbox.stub(sails.helpers.discord, 'sendMessage');
    guildStub = {
      channels: { fetch: sandbox.stub() }
    };
    clientStub = sandbox.stub(sails.helpers.discord, 'getClient')
      .returns({
        guilds: { fetch: () => guildStub }
      });
  });

  it('Calls the helper', async () => {
    guildStub.channels.fetch.returns(true);
    await SdtdConfig.update({ server: sails.testServer.id }, { discordGuildId: '336821518250147850' });
    await instance.run(sails.testServer, '521825197666467840, Heya!');
    expect(stub).to.have.been.calledOnce;
  });
  it('Errors when invalid channel', async () => {
    return expect(instance.run(sails.testServer, ['afafsafsa', 'Heya!'].join(','))).to.be.rejectedWith('Invalid channel ID');
  });

  it('Errors when no content', async () => {
    return expect(instance.run(sails.testServer, ['564473658718814248'].join(','))).to.be.rejectedWith('No content');
  });

  it('Should only send message to channels linked to the server', async () => {
    guildStub.channels.fetch.returns(undefined);

    await SdtdConfig.update({ server: sails.testServer.id }, { discordGuildId: '408631230179835925' });

    // This channel ID is not inside the servers Discord guild
    await expect(instance.run(sails.testServer, '564473658718814248, Heya!')).to.be.rejectedWith('Channel 564473658718814248 not found');

    expect(stub).to.not.have.been.calledOnce;

  });

});
