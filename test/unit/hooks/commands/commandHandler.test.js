const commandListener = require('../../../../worker/processors/sdtdCommands');
const { expect } = require('chai');
const EventEmitter = require('events');

describe('COMMAND CommandHandler', () => {
  beforeEach(async () => {
    this.executeCommandStub = sandbox.stub(sails.helpers.sdtdApi, 'executeConsoleCommand').callsFake(async () => {
      return {
        result: ''
      };
    });
    sails.testServerConfig = (await SdtdConfig.update(sails.testServerConfig.id, { replyPrefix: 'test',commandsEnabled: true }).fetch())[0];
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
      messageText: `$ping`,
      steamId: sails.testPlayer.steamId
    };
    await commandListener({data: {data: chatMessage, server: sails.testServer}});
    expect(this.executeCommandStub.callCount).to.be.equal(1);
    for (const call of this.executeCommandStub.getCalls()) {
      expect(call.lastArg).to.match(/pm \d* "test/);
    }
  });

  it('Does not execute a command if commands are disabled on server', async () => {
    await SdtdConfig.update({server: sails.testServer.id}, {commandsEnabled: false});
    const chatMessage = {
      messageText: `$ping`,
      steamId: sails.testPlayer.steamId
    };
    await commandListener({data: {data: chatMessage, server: sails.testServer}});
    expect(this.executeCommandStub.callCount).to.be.equal(1);
  });
  it('Ignores chat messages sent by server', async () => {
    const chatMessage = {
      messageText: `$ping`,
      playerName: 'Server'
    };
    await commandListener({data: {data: chatMessage, server: sails.testServer}});
    expect(this.executeCommandStub.callCount).to.be.equal(0);
  });
  it('Exits gracefully when an invalid player was detected', async () => {
    const chatMessage = {
      messageText: `$ping`,
      steamId: null,
      playerName: null
    };
    await commandListener({data: {data: chatMessage, server: sails.testServer}});
    expect(this.executeCommandStub.callCount).to.be.equal(0);
  });
  xit('Runs all the built in commands', async () => {
    // loop over commands
    // maybe force them disabled to not have to mock too much here
  });
  xit('Can run custom commands', async () => {});
  xit('', async () => {});
  xit('', async () => {});
  xit('', async () => {});


});
