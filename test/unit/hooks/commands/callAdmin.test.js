const Command = require('../../../../api/hooks/sdtdCommands/commands/callAdmin');
const sinon = require('sinon');
const { expect } = require('chai');

describe('COMMAND callAdmin', () => {
  let spy = sinon.spy();
  beforeEach(() => {
    spy.resetHistory();
    command = new Command(sails.testServer.id);
    chatMessage = { reply: spy };
    sandbox.stub(sails.helpers.sdtd, 'createTicket')
      .returns(Promise.resolve({}));
  });

  it('creates a ticket', async () => {
    await command.run(chatMessage, sails.testPlayer, sails.testServer, ['pls', 'help']);

    expect(spy).to.have.been.calledOnceWith('callAdminSuccess');
    expect(sails.helpers.sdtd.createTicket).to.have.been.calledWith(sails.testServer.id, sails.testPlayer.id, 'pls help');
  });

  it('Errors correctly when no message provided', async () => {
    await command.run(chatMessage, sails.testPlayer, sails.testServer, []);

    expect(spy).to.have.been.calledOnceWith('callAdminMissingReason');
    expect(sails.helpers.sdtd.createTicket).to.not.have.been.called;
  });

  it('Errors correctly when message too long', async () => {
    await command.run(chatMessage, sails.testPlayer, sails.testServer, Array(100).fill('a'));

    expect(spy).to.have.been.calledOnceWith('callAdminTooLong');
    expect(sails.helpers.sdtd.createTicket).to.not.have.been.called;
  });

});
