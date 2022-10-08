const fn = require('../../../worker/util/customFunctions/removeTele');

describe('CustomFunction removeTele', function () {
  let instance;
  let teleport;
  beforeEach(async () => {
    instance = new fn();
    teleport = await PlayerTeleport.create({
      name: 'test',
      server: sails.testServer.id,
      player: sails.testPlayer.id,
      x: 1,
      y: 2,
      z: 3
    }).fetch();

  });

  it('Removes a teleport', async () => {
    await instance.run(sails.testServer, ['test', sails.testPlayer.id].join(','));
    const teleAfter = await PlayerTeleport.findOne({ id: teleport.id });

    expect(teleAfter).to.be.equal(undefined);
  });

  it('Errors when missing args', async () => {
    return expect(instance.run(sails.testServer, [sails.testPlayer.id].join(','))).to.be.rejectedWith('No player arg provided');
  });

  it('Can find the player via steamId', async () => {
    await instance.run(sails.testServer, ['test', sails.testPlayer.steamId].join(','));
    const teleAfter = await PlayerTeleport.findOne({ id: teleport.id });

    expect(teleAfter).to.be.equal(undefined);
  });

  it('Can find the player via crossId', async () => {
    await instance.run(sails.testServer, ['test', sails.testPlayer.crossId].join(','));
    const teleAfter = await PlayerTeleport.findOne({ id: teleport.id });

    expect(teleAfter).to.be.equal(undefined);
  });

  it('Errors when player not found', async () => {
    return expect(instance.run(sails.testServer, ['test', 'this doesnt exist'].join(','))).to.be.rejectedWith('Player not found in database, searched for: this doesnt exist');
  });

});
