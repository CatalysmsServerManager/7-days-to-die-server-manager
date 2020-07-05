const ChatBridgeChannel = require('../../../../api/hooks/discordChatBridge/chatBridgeChannel');

describe('ChatBridgeChannel', function () {
  it('Doesnt try to do anything when non player connects', async function () {
    sandbox.stub(sails.hooks.sdtdlogs, 'getLoggingObject').callsFake(async () => null);
    sandbox.stub(ChatBridgeChannel.prototype, 'start').callsFake(async () => null);

    const textChannel = {};
    const cbc = new ChatBridgeChannel(textChannel, sails.testServer);
    await cbc.sendRichConnectedMessageToDiscord({
      player: undefined
    });
  });
});

