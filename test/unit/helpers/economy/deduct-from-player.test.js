describe('Deduct currency from player', function () {
  it('Handles many calls at once properly', async () => {

    const promises = [];
    // Make sure the player has enough currency in their wallet to perform this test
    await Player.update({
      id: sails.testPlayer.id
    }, {
      currency: 9001
    });

    const startPlayer = await Player.findOne(sails.testPlayer.id);

    for (let i = 0; i < 100; i++) {
      promises.push(sails.helpers.economy.deductFromPlayer(sails.testPlayer.id, 1, 'test', false));
    }

    await Promise.all(promises);
    const endPlayer = await Player.findOne(sails.testPlayer.id);

    expect(startPlayer.currency - 100).to.be.equal(endPlayer.currency);

  });

  it('Handles many calls at once properly when player doesnt have enough', async () => {

    const promises = [];
    await Player.update({
      id: sails.testPlayer.id
    }, {
      currency: 50
    });

    for (let i = 0; i < 100; i++) {
      promises.push(sails.helpers.economy.deductFromPlayer(sails.testPlayer.id, 1, 'test', false));
    }

    try {
      // It's going to error because it's trying to set currency to a negative value
      // That's fine, catch it and move on
      await Promise.all(promises);
    } catch (e) {

    }
    const endPlayer = await Player.findOne(sails.testPlayer.id);

    expect(endPlayer.currency).to.be.equal(0);

  });

});
