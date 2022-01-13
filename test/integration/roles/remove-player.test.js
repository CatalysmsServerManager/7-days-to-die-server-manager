const faker = require('faker');
const supertest = require('supertest');

describe('delete /api/role/player', () => {
  const testRoles = {
    ADMIN_ROLE: undefined,
    MOD_ROLE: undefined,
    PLAYER_ROLE: undefined,
  };
  beforeEach(async function () {
    // Create some default roles
    const ADMIN_ROLE = await Role.create({
      server: sails.testServer.id,
      name: 'Admin',
      level: '1',
      manageServer: true
    }).fetch();
    testRoles.ADMIN_ROLE = ADMIN_ROLE;

    const MOD_ROLE = await Role.create({
      server: sails.testServer.id,
      name: 'Mod',
      level: '50',
      managePlayers: true
    }).fetch();
    testRoles.MOD_ROLE = MOD_ROLE;

    const PLAYER_ROLE = await Role.create({
      server: sails.testServer.id,
      name: 'Player',
      level: '1000',
    }).fetch();
    testRoles.PLAYER_ROLE = PLAYER_ROLE;

    await Promise.all(Object.values(testRoles));

    await Player.update({ id: sails.testPlayer2.id }, { role: testRoles.MOD_ROLE.id});

    return;

  });

  afterEach(async function () {
    await Role.destroy({
      id: Object.keys(testRoles).map(r => r.id)
    });
  });

  it('Happy path - remove a player from a role', async () => {
    return supertest(sails.hooks.http.mockApp)
      .delete('/api/role/player')
      .send({
        playerId: sails.testPlayer2.id,
        serverId: sails.testServer.id,
      })
      .expect(200)
      .then(async function () {
        const player2 = await Player.findOne({
          id: sails.testPlayer2.id,
        });
        expect(player2.role).to.eq(null);
      });
  });
  it('Does not allow someone with low perms to remove role of someone with higher level permission', async () => {
    return supertest(sails.hooks.http.mockAppLowPriv)
      .delete('/api/role/player')
      .send({
        playerId: sails.testPlayer.id,
        serverId: sails.testServer.id
      })
      .expect(403)
      .expect((res) => {
        expect(res.body.error).to.equal('You cannot change the role of someone with a higher or equal role.');
      });
  });
  it('Does not allow someone with low perms to remove role of someone with the same perm level', async () => {
    const newPlayer = await Player.create({
      steamId: faker.datatype.number({ min: 0, max: 9999999999999 }),
      entityId: 1337,
      server: sails.testServer.id,
      name: faker.internet.userName(),
      role: testRoles.MOD_ROLE.id
    }).fetch();
    return supertest(sails.hooks.http.mockAppLowPriv)
      .delete('/api/role/player')
      .send({
        playerId: newPlayer.id,
        serverId: sails.testServer.id
      })
      .expect(403)
      .expect((res) => {
        expect(res.body.error).to.equal('You cannot change the role of someone with a higher or equal role.');
      });
  });

  it('Allows server owners to do what they want, without checking role levels', async () => {
    return supertest(sails.hooks.http.mockApp)
      .delete('/api/role/player')
      .send({
        playerId: sails.testPlayer.id,
        roleId: testRoles.ADMIN_ROLE.id
      })
      .expect(200);
  });
});
