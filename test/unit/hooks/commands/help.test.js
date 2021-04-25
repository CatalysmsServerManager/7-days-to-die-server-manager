const Command = require('../../../../worker/processors/sdtdCommands/commands/help');
const sinon = require('sinon');
const { expect } = require('chai');

describe('COMMAND help', () => {
  let spy = sinon.spy();
  beforeEach(() => {
    spy.resetHistory();
    command = new Command(sails.testServer.id);
    chatMessage = { reply: spy };
    sandbox.stub(sails.helpers.sdtdApi, 'executeConsoleCommand').returns(Promise.resolve(
      {}
    ));
  });

  it('runs', async () => {
    const serverWithConfig = sails.testServer;
    serverWithConfig.config = sails.testServerConfig;
    await command.run(chatMessage, sails.testPlayer, serverWithConfig, []);

    expect(spy.callCount).to.be.equal(12);
  });

  it('Can search for a specific command', async () => {
    const serverWithConfig = sails.testServer;
    serverWithConfig.config = sails.testServerConfig;
    await command.run(chatMessage, sails.testPlayer, serverWithConfig, ['ping']);
    expect(spy.firstCall.firstArg).to.be.equal('ping - PONG!');
  });

  it('Can list custom commands by player role', async () => {
    const createdRole = await Role.create({
      server: sails.testServer.id,
      name: 'TestRole',
      level: 10,
      manageServer: true
    }).fetch();
    await CustomCommand.create({
      server: sails.testServer.id,
      name: 'testAllowed',
      commandsToExecute: 'say test',
      level: 50
    });
    await CustomCommand.create({
      server: sails.testServer.id,
      name: 'testForbidden',
      commandsToExecute: 'say test',
      level: 1
    });
    await Player.update({ id: sails.testPlayer.id }, { role: createdRole.id });
    const serverWithConfig = sails.testServer;
    serverWithConfig.config = sails.testServerConfig;
    await command.run(chatMessage, sails.testPlayer, serverWithConfig, []);
    expect(spy).to.have.been.calledWith('testAllowed - No information given');
    expect(spy).to.not.have.been.calledWith('testForbidden - No information given');
    expect(spy.callCount).to.be.equal(13);
  });

});
