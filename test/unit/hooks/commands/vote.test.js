const Command = require('../../../../worker/processors/sdtdCommands/commands/vote');
const sinon = require('sinon');
const { expect } = require('chai');

describe('COMMAND vote', () => {
  let spy = sinon.spy();
  let server;
  beforeEach(() => {
    spy.resetHistory();
    command = new Command(sails.testServer.id);
    chatMessage = { reply: spy };
    sandbox.stub(sails.helpers.sdtdApi, 'executeConsoleCommand').returns(Promise.resolve(
      {}
    ));
    server = sails.testServer;
    server.config = sails.testServerConfig;
    server.config.votingApiKey = '12345abcde';
  });

  it('Returns properly when a user hasnt voted', async () => {
    sandbox.stub(command, 'checkIfUserVoted').resolves('0');
    await command.run(chatMessage, sails.testPlayer, server, []);
    expect(spy).to.have.been.calledWith('notVoted');
  });

  it('Awards when a user has voted and sets claimed', async () => {
    sandbox.stub(command, 'checkIfUserVoted').resolves('1');
    sandbox.stub(sails.helpers.sdtd, 'executeCustomCmd').resolves();
    const claimSpy = sandbox.stub(command, 'setVoteClaimed').resolves();
    await command.run(chatMessage, sails.testPlayer, server, []);
    expect(spy).to.not.have.been.called;
    expect(claimSpy).to.have.been.calledWith(sails.testPlayer.steamId, sinon.match.string);
  });

  it('Returns properly if the user already claimed their vote', async () => {
    sandbox.stub(command, 'checkIfUserVoted').resolves('2');
    await command.run(chatMessage, sails.testPlayer, server, []);
    expect(spy).to.have.been.calledWith('alreadyClaimed');
  });


  it('Handles a player spamming command properly', async () => {
    sandbox.stub(command, 'checkIfUserVoted').resolves('1');
    sandbox.stub(sails.helpers.sdtd, 'executeCustomCmd').resolves();
    const claimSpy = sandbox.stub(command, 'setVoteClaimed').resolves();

    const promises = [];
    for (let i = 0; i < 10; i++) {
      promises.push(command.run(chatMessage, sails.testPlayer, server, []));
    }

    await Promise.all(promises);

    expect(spy).to.have.been.calledWith('voteLock');
    expect(claimSpy).to.have.been.calledOnceWith(sails.testPlayer.steamId, sinon.match.string);
  });

  it('Handles lock properly when something errors', async () => {
    sandbox.stub(command, 'checkIfUserVoted').resolves('1');
    sandbox.stub(sails.helpers.sdtd, 'executeCustomCmd').resolves();
    const claimSpy = sandbox.stub(command, 'setVoteClaimed')
      .onCall(0).rejects()
      .onCall(1).resolves();

    try {
      await command.run(chatMessage, sails.testPlayer, server, []);
    } catch (error) {
      // This call errors because we force it to :)
      // lets ignore the error
    }
    await command.run(chatMessage, sails.testPlayer, server, []);

    expect(spy).to.not.have.been.calledWith('voteLock');
    expect(claimSpy).to.have.been.calledWith(sails.testPlayer.steamId, sinon.match.string);
  });
});
