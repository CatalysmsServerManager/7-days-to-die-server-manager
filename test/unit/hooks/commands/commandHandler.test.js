const CommandHandler = require('../../../../api/hooks/sdtdCommands/commandHandler');
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
    this.commandHandler = new CommandHandler(sails.testServer.id, this.emitter, sails.testServerConfig);
    this.commandHandler.start();
  });

  afterEach(() => {
    this.commandHandler.stop();
  });

  it('Respects the replyPrefix', async () => {
    const chatMessage = {
      messageText: `${sails.testServerConfig.commandPrefix}help`,
      steamId: sails.testPlayer.steamId
    };
    await this.commandHandler.commandListener(chatMessage);
    expect(this.stub.callCount).to.be.equal(11);
    for (const call of this.stub.getCalls()) {
      expect(call.lastArg).to.match(/pm \d* "test/);
    }
  });




});
