const Command = require('../../../../api/hooks/sdtdCommands/commands/tele');
const sinon = require('sinon');
const { expect } = require('chai');

describe('COMMAND tele', () => {
  let command;
  let spy;
  let chatMessage;

  before(() => {
    command = new Command(sails.testServer.id);
    spy = sinon.spy();
    chatMessage = { reply: spy };

    sails.testServer.config.playerTeleportDelay = 0;
  });

  beforeEach(() => {
    spy.resetHistory();
    sandbox.stub(sails.helpers.sdtdApi, 'executeConsoleCommand').returns(Promise.resolve(
      {}
    ));
  });

  it('Replies "NoTeleportFound" when a player has no teleports set', async () => {
    await command.run(chatMessage, sails.testPlayer, sails.testServer, ['teleportName']);

    expect(spy).to.have.been.calledOnceWith('NoTeleportFound');
    expect(sails.helpers.sdtdApi.executeConsoleCommand).to.not.have.been.called;

  });
  it('Tells players they are on cooldown', async () => {
    sails.testPlayer.lastTeleportTime = Date.now();
    sails.testServer.config.playerTeleportTimeout = 10000;

    sandbox.stub(PlayerTeleport, 'find').resolves([{ name: 'teleportName' }]);

    await command.run(chatMessage, sails.testPlayer, sails.testServer, ['teleportName']);

    expect(spy).to.have.been.calledOnceWith('teleCooldown');
    expect(sails.helpers.sdtdApi.executeConsoleCommand).to.not.have.been.called;

    sails.testServer.config.playerTeleportTimeout = 0;
  });
  it('Tells players they don\'t have enough money', async () => {
    sails.testServer.config.costToTeleport = 5;
    sails.testServer.config.economyEnabled = true;
    sandbox.stub(sails.helpers.economy, 'getPlayerBalance').resolves(3);
    sandbox.stub(PlayerTeleport, 'find').resolves([{ name: 'teleportName' }]);

    await command.run(chatMessage, sails.testPlayer, sails.testServer, ['teleportName']);

    expect(spy).to.have.been.calledOnceWith('notEnoughMoney');
    expect(sails.helpers.sdtdApi.executeConsoleCommand).to.not.have.been.called;
    sails.testServer.config.costToTeleport = 0;
  });

  it('Teleports a player', async () => {
    sandbox.stub(PlayerTeleport, 'find').resolves([{ name: 'teleportName', timesUsed: 5 }]);

    await command.run(chatMessage, sails.testPlayer, sails.testServer, ['teleportName']);

    expect(spy).to.have.been.calledOnceWith('teleSuccess');
    expect(sails.helpers.sdtdApi.executeConsoleCommand).to.have.been.called;

  });
  it('Teleports a player to a public teleport made by another player', async () => {

    sandbox.stub(PlayerTeleport, 'find')
      .onCall(0)
      .resolves([{ name: 'teleportName', timesUsed: 5 }])
      .onCall(1)
      .resolves([{ name: 'publicTeleport', timesUsed: 1337, publicEnabled: true }]);

    await command.run(chatMessage, sails.testPlayer, sails.testServer, ['publicTeleport']);

    expect(spy).to.have.been.calledOnceWith('teleSuccess', { teleport: { name: 'publicTeleport', timesUsed: 1337, publicEnabled: true } });
    expect(sails.helpers.sdtdApi.executeConsoleCommand).to.have.been.called;

  });

  it('Delays a teleport if configured', async () => {
    // TODO: how do you bend time in a test?
  });



  // https://github.com/CatalysmsServerManager/7-days-to-die-server-manager/issues/291
  it('Defaults to a players own teles instead of public ones', async () => { });


});
