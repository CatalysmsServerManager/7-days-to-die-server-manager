const commandListener = require('../../../../worker/processors/sdtdCommands');
const { expect } = require('chai');
const EventEmitter = require('events');

describe('COMMAND CommandHandler', () => {
  beforeEach(async () => {
    this.stub = sandbox.stub(sails.helpers.sdtdApi, 'executeConsoleCommand').callsFake(async () => {
      return {
        result: ''
      };
    });
    sails.testServerConfig = (await SdtdConfig.update(sails.testServerConfig.id, { replyPrefix: 'test' }).fetch())[0];
    await Role.create({
      server: sails.testServer.id,
      name: 'Admin',
      level: '1',
      manageServer: true
    });

    this.emitter = new EventEmitter();
  });


  it('Respects the replyPrefix', async () => {
    const chatMessage = {
      messageText: `${sails.testServerConfig.commandPrefix}help`,
      steamId: sails.testPlayer.steamId
    };
    await commandListener({data: {data: chatMessage, server: sails.testServer}});
    expect(this.stub.callCount).to.be.equal(11);
    for (const call of this.stub.getCalls()) {
      expect(call.lastArg).to.match(/pm \d* "test/);
    }
  });




});
