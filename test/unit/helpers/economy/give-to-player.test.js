describe('Give currency to player', function () {
  it('Handles many calls at once properly', async () => {

    const promises = [];
    const startPlayer = await Player.findOne(sails.testPlayer.id);

    for (let i = 0; i < 100; i++) {
      promises.push(sails.helpers.economy.giveToPlayer(sails.testPlayer.id, 1, 'test', false));
    }

    await Promise.all(promises);
    const endPlayer = await Player.findOne(sails.testPlayer.id);

    expect(startPlayer.currency + 100).to.be.equal(endPlayer.currency);

  });

});
