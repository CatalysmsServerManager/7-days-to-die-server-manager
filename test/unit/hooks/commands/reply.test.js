const { expect } = require('chai');
const reply = require('../../../../worker/processors/sdtdCommands/sendReply');
const sinon = require('sinon');

describe('command reply', () => {
  let spy;
  beforeEach(() => {
    spy = sandbox.stub(sails.helpers.sdtdApi, 'executeConsoleCommand').resolves(true);
    sails.testServer.config = sails.testServerConfig;
  });

  it('Sends a pm to the player', async () => {
    sandbox.stub(sails.helpers.sdtd, 'checkCpmVersion').returns(0);
    await reply(sails.testServer, sails.testPlayer, 'something', {});
    expect(spy).to.have.been.calledOnceWith(sinon.match.any, `pm ${sails.testPlayer.entityId} "something"`);
  });

  it('Can use replyType templates', async () => {
    sandbox.stub(sails.helpers.sdtd, 'checkCpmVersion').returns(0);
    await reply(sails.testServer, sails.testPlayer, 'error', {error: 'totally a real error'});
    expect(spy).to.have.been.calledOnceWith(sinon.match.any, `pm ${sails.testPlayer.entityId} "Oh no, an error occurred! Please contact a server admin. Error: totally a real error"`);
  });

  it('Switches to pm2 when CPM is installed', async () => {
    sandbox.stub(sails.helpers.sdtd, 'checkCpmVersion').returns(10.0);
    sails.testServer.config.replyServerName = 'aaa';
    await reply(sails.testServer, sails.testPlayer, 'message', {});
    expect(spy).to.have.been.calledOnceWith(sinon.match.any, `pm2 "aaa" ${sails.testPlayer.entityId} "message"`);
  });

  it('Switches to pm2 when CPM is installed and defaults to "CSMM"', async () => {
    sandbox.stub(sails.helpers.sdtd, 'checkCpmVersion').returns(10.0);
    await reply(sails.testServer, sails.testPlayer, 'message', {});
    expect(spy).to.have.been.calledOnceWith(sinon.match.any, `pm2 "CSMM" ${sails.testPlayer.entityId} "message"`);
  });

});
