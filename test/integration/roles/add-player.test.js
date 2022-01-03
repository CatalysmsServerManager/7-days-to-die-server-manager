const faker = require('faker');
const supertest = require('supertest');

describe('post /api/role/player', () => {
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

  it('Happy path - adds a player to a role', async () => {
    return supertest(sails.hooks.http.mockApp)
      .post('/api/role/player')
      .send({
        playerId: sails.testPlayer2.id,
        roleId: testRoles.PLAYER_ROLE.id
      })
      .expect(200)
      .then(async function () {
        const player2 = await Player.findOne({
          id: sails.testPlayer2.id
        });
        expect(player2.role).to.equal(testRoles.PLAYER_ROLE.id);
      });
  });
  it('Does not allow someone with low perms to add someone to a higher level permission', async () => {
    return supertest(sails.hooks.http.mockAppLowPriv)
      .post('/api/role/player')
      .send({
        playerId: sails.testPlayer.id,
        roleId: testRoles.PLAYER_ROLE.id
      })
      .expect(403)
      .expect((res) => {
        expect(res.body.error).to.equal('You cannot change the role of someone with a higher or equal role.');
      });
  });
  it('Does not allow someone with low perms to add someone the same perm level', async () => {
    const newPlayer = await Player.create({
      steamId: faker.datatype.number({ min: 0, max: 9999999999999 }),
      entityId: 1337,
      server: sails.testServer.id,
      name: faker.internet.userName(),
    }).fetch();
    return supertest(sails.hooks.http.mockAppLowPriv)
      .post('/api/role/player')
      .send({
        playerId: newPlayer.id,
        roleId: testRoles.MOD_ROLE.id
      })
      .expect(403)
      .expect((res) => {
        expect(res.body.error).to.equal('You can only set a players role to a role lower than your own.');
      });
  });
});
