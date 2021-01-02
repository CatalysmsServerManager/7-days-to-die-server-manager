const Command = require('../../../../api/hooks/sdtdCommands/commands/claim');
const { expect } = require('chai');
const sinon = require('sinon');

describe('COMMAND claim', () => {
  let spy = sinon.spy();
  beforeEach(async () => {
    spy.resetHistory();
    for (let i = 0; i < 15; i++) {
      await PlayerClaimItem.create({
        name: 'listing.name',
        amount: 1,
        quality: 0,
        player: sails.testPlayer.id
      });
    }
    command = new Command(sails.testServer.id);
    chatMessage = { reply: spy };
    sandbox.stub(sails.helpers.sdtd, 'checkCpmVersion').returns(7.0);
    sandbox.stub(sails.helpers.sdtdApi, 'executeConsoleCommand').returns({ result: '' });
  });

  it('Claims first 10 items', async () => {
    let claimedItems = await PlayerClaimItem.find({ claimed: true, player: sails.testPlayer.id });
    expect(claimedItems.length).to.be.equal(0);

    await command.run(chatMessage, sails.testPlayer, sails.testServer, []);

    claimedItems = await PlayerClaimItem.find({ claimed: true, player: sails.testPlayer.id });
    expect(claimedItems.length).to.be.equal(10);
  });

  it('Can list items to be claimed', async () => {
    let claimedItems = await PlayerClaimItem.find({ claimed: true, player: sails.testPlayer.id });
    expect(claimedItems.length).to.be.equal(0);
    await command.run(chatMessage, sails.testPlayer, sails.testServer, ['list']);
    expect(spy.callCount).to.be.equal(16);
    claimedItems = await PlayerClaimItem.find({ claimed: true, player: sails.testPlayer.id });
    expect(claimedItems.length).to.be.equal(0);
  });

  it('Can claim a configurable amount of items', async () => {
    let claimedItems = await PlayerClaimItem.find({ claimed: true, player: sails.testPlayer.id });
    expect(claimedItems.length).to.be.equal(0);

    await command.run(chatMessage, sails.testPlayer, sails.testServer, ['5']);

    claimedItems = await PlayerClaimItem.find({ claimed: true, player: sails.testPlayer.id });
    expect(claimedItems.length).to.be.equal(5);
  });

  it('Handles invalid args properly', async () => {
    let claimedItems = await PlayerClaimItem.find({ claimed: true, player: sails.testPlayer.id });
    expect(claimedItems.length).to.be.equal(0);

    await command.run(chatMessage, sails.testPlayer, sails.testServer, ['notavalidnumber']);

    claimedItems = await PlayerClaimItem.find({ claimed: true, player: sails.testPlayer.id });
    expect(claimedItems.length).to.be.equal(10);
  });

  it('Handles a player spamming command properly', async () => {
    let claimedItems = await PlayerClaimItem.find({ claimed: true, player: sails.testPlayer.id });
    expect(claimedItems.length).to.be.equal(0);

    const promises = [];
    for (let i = 0; i < 10; i++) {
      promises.push(command.run(chatMessage, sails.testPlayer, sails.testServer, []));
    }

    await Promise.all(promises);

    expect(spy).to.have.been.calledWith('claimLock');
    expect(sails.helpers.sdtdApi.executeConsoleCommand.callCount).to.be.equal(10);

  });

  it('Releases the lock after an error giving the items', async () => {
    let claimedItems = await PlayerClaimItem.find({ claimed: true, player: sails.testPlayer.id });
    expect(claimedItems.length).to.be.equal(0);

    sails.helpers.sdtdApi.executeConsoleCommand.resolves({ result: 'ERR: fake error' });

    await command.run(chatMessage, sails.testPlayer, sails.testServer, []);

    expect(spy).to.have.been.calledWith('error');

    sails.helpers.sdtdApi.executeConsoleCommand.resolves({ result: 'All good' });

    await command.run(chatMessage, sails.testPlayer, sails.testServer, []);
    expect(spy).to.not.have.been.calledWith('claimLock');
    expect(sails.helpers.sdtdApi.executeConsoleCommand.callCount).to.be.equal(11);


  });


});
