const expect = require('chai').expect;
const Command = require('../../../../api/hooks/discordBot/commands/sdtd/status');
const Channel = require('discord.js').TextChannel;
const customEmbed = require('../../../../api/hooks/discordBot/util/createEmbed').CustomEmbed;

describe('Discord - status', function () {
  let sendStub;
  let serverInfoResponse;
  beforeEach(() => {
    serverInfoResponse = {
      stats: {
        gametime: { days: 5, hours: 15, minutes: 33},
        players: 13,
        hostiles: 5,
        animals: 0
      },
      serverInfo: {}
    };
    const playerInfoResponse = [
      {name: 'Player a'}, {name: 'Player b'}
    ];
    sandbox.stub(SdtdConfig, 'find').callsFake(() => ['random server']);
    sandbox.stub(SdtdServer, 'findOne').callsFake(() => sails.testServer);
    sendStub = sandbox.stub(Channel.prototype, 'send').callsFake(() => null);
    sandbox.stub(sails.helpers, 'loadSdtdserverInfo').callsFake(async () => serverInfoResponse);
    sandbox.stub(sails.helpers.sdtd, 'loadFps').callsFake(async () => 15);
    sandbox.stub(sails.helpers.sdtd, 'loadPlayerData').value({ with: async () => playerInfoResponse });
    Command.prototype.client = {customEmbed: customEmbed};
  });

  it('Sends a discord message', async function () {

    await Command.prototype.run(
      {
        guild: { id: 'someGuildId'},
        channel: new Channel({}, {})
      },
      { server: 1});

    expect(Channel.prototype.send).to.have.been.calledOnce;
    const sendCall = sendStub.getCall(0).firstArg;
    const playersOnlineField = sendCall.fields.find(_ => _.name.includes('players online'));
    const playersOnline = parseInt(playersOnlineField.name.split(' ')[0]);
    expect(playersOnline).to.be.equal(serverInfoResponse.stats.players);
  });
});
