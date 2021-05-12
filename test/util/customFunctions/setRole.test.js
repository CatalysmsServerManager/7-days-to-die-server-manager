const { expect } = require('chai');
const fn = require('../../../worker/util/customFunctions/setRole');

describe('CustomFunction setRole', function () {
  let instance;
  let role;
  beforeEach(async () => {
    instance = new fn(sails.testServer);
    role = await Role.create({ name: 'test', level: 5, server: sails.testServer.id }).fetch();
  });

  it('Sets the players role', async () => {
    await instance.run([sails.testPlayer.id, role.name].join(','));
    const player = await Player.findOne(sails.testPlayer.id).populate('role');
    if (!player.role) { throw new Error('Player has no role set'); }
    expect(player.role.id).to.be.equal(role.id);
  });
  it('Errors when player not found', async () => {
    return expect(instance.run([1337, role.name].join(','))).to.be.rejectedWith('Unknown player');
  });

  it('Errors when role not found', async () => {
    return expect(instance.run([sails.testPlayer.id, 1337].join(','))).to.be.rejectedWith('Unknown role');
  });

});
