const Command = require('../../../../worker/processors/sdtdCommands/commands/tele');
const sinon = require('sinon');
const { expect } = require('chai');

describe('COMMAND tele', () => {
  let command;
  let spy = sinon.spy();
  let chatMessage;

  beforeEach(async () => {
    command = new Command(sails.testServer.id);
    chatMessage = { reply: spy };
    sails.testServer = await SdtdServer.findOne(sails.testServer.id).populate('config').populate('players');
    sails.testServer.config.playerTeleportDelay = 0;
    sails.testServer.config.playerTeleportTimeout = 0;
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
      .resolves([{ name: 'publicTeleport', timesUsed: 1337, publicEnabled: true }])
      .onCall(1)
      .resolves([{ name: 'teleportName', timesUsed: 5 }]);

    await command.run(chatMessage, sails.testPlayer, sails.testServer, ['publicTeleport']);

    expect(spy).to.have.been.calledOnceWith('teleSuccess', { teleport: { name: 'publicTeleport', timesUsed: 1337, publicEnabled: true } });
    expect(sails.helpers.sdtdApi.executeConsoleCommand).to.have.been.called;

  });

  it('Delays a teleport if configured', async () => {
    sails.testPlayer.lastTeleportTime = 1;
    const clock = sinon.useFakeTimers(Date.now());
    sails.testServer.config.playerTeleportDelay = 1;
    sandbox.stub(PlayerTeleport, 'find').resolves([{ name: 'teleportName', timesUsed: 5 }]);

    command.run(chatMessage, sails.testPlayer, sails.testServer, ['teleportName']);
    expect(sails.helpers.sdtdApi.executeConsoleCommand).to.not.have.been.called;
    await clock.runAllAsync();

    expect(spy).to.have.been.calledWith('teleDelay');
    expect(spy).to.have.been.calledWith('teleSuccess');
    expect(spy).to.have.been.calledTwice;
    expect(sails.helpers.sdtdApi.executeConsoleCommand).to.have.been.called;
    clock.restore();
  });

  // https://github.com/CatalysmsServerManager/7-days-to-die-server-manager/issues/291
  it('Defaults to a players own teles instead of public ones', async () => {
    sandbox.stub(PlayerTeleport, 'find')
      .onCall(0)
      .resolves([{ name: 'teleportName', timesUsed: 1337, publicEnabled: true }])
      .onCall(1)
      .resolves([{ name: 'teleportName', timesUsed: 5, publicEnabled: false }]);

    await command.run(chatMessage, sails.testPlayer, sails.testServer, ['teleportName']);

    expect(spy).to.have.been.calledOnceWith('teleSuccess', { teleport: { name: 'teleportName', timesUsed: 5, publicEnabled: false } });
    expect(sails.helpers.sdtdApi.executeConsoleCommand).to.have.been.called;
  });

});
