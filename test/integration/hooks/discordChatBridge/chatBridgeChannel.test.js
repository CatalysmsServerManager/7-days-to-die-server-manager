const expect = require("chai").expect;
const sinon = require('sinon');
const ChatBridgeChannel = require("../../../../api/hooks/discordChatBridge/chatBridgeChannel");

describe('ChatBridgeChannel', function () {
  it('Doesnt try to do anything when non player connects', async function () {
    sinon.stub(sails.hooks.sdtdlogs, "getLoggingObject").callsFake(async () => null);
    sinon.stub(ChatBridgeChannel.prototype, "start").callsFake(async () => null);

    const textChannel = {};
    const cbc = new ChatBridgeChannel(textChannel, sails.testServer);
    await cbc.sendRichConnectedMessageToDiscord({
      player: undefined
    });
  });
});

