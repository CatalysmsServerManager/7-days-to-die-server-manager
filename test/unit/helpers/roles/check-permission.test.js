const chai = require('chai');
const expect = chai.expect;
const faker = require('faker');
const permissionFields = ['manageServer', 'manageEconomy', 'managePlayers', 'manageTickets', 'viewAnalytics', 'viewDashboard', 'useTracking', 'useChat', 'useCommands', 'manageGbl', 'discordExec', 'discordLookup'];

const testRoles = [];
const testPlayers = [];

const OtherServerRoles = [{
  server: 65489654,
  name: 'Player',
  level: '2000'
},
{
  server: 65489654,
  name: 'Player',
  level: '1000'
},
{
  server: 65489654,
  name: 'Admin',
  level: '0'
}
];

chai.config.truncateThreshold = 0;


describe('HELPER roles/check-permission', () => {
  beforeEach(async function () {
    // Create some default roles
    let createdRole = await Role.create({
      server: sails.testServer.id,
      name: 'Admin',
      level: '1',
      manageServer: true
    }).fetch();
    testRoles.push(createdRole);

    createdRole = await Role.create({
      server: sails.testServer.id,
      name: 'Player',
      level: '2000',
      amountOfTeleports: 2
    }).fetch();
    testRoles.push(createdRole);

    createdRole = await Role.create({
      server: sails.testServer.id,
      name: 'Default',
      level: '5000',
      isDefault: true
    }).fetch();
    testRoles.push(createdRole);

    await Promise.all(testRoles);
    return;

  });

  afterEach(async function () {

    await Player.destroy({
      id: testPlayers.map(p => p.id)
    });
    await Role.destroy({
      id: testRoles.map(r => r.id)
    });
    testPlayers.length = 0;
    testRoles.length = 0;
  });

  it('Returns an object with attributes "hasPermission" and "role"', async function () {
    let result = await sails.helpers.roles.checkPermission.with({
      userId: sails.testUser.id,
      serverId: sails.testServer.id,
      permission: 'manageServer'
    });
    expect(result.hasPermission).to.be.an('boolean');
    expect(result.hasPermission).to.be.eq(true);
    expect(result.role).to.be.an('object');
    return;
  });

  it(`Correctly checks if a user has the correct permission for the player role via user ID`, async function () {
    let playerRole = testRoles.filter(r => r.name === 'Player')[0];
    let player = await mockPlayer({
      roleId: playerRole.id
    });
    let promises = permissionFields.map(async function (field) {

      let result = await sails.helpers.roles.checkPermission.with({
        userId: player.user,
        serverId: sails.testServer.id,
        permission: field
      });

      return expect(result.hasPermission).to.be.eq(false);
    });
    return Promise.all(promises);
  });

  it(`Correctly checks if a user has the correct permission for the admin role via user ID`, async function () {
    let playerRole = testRoles.filter(r => r.name === 'Admin')[0];
    let player = await mockPlayer({
      roleId: playerRole.id
    });
    let promises = permissionFields.map(async function (field) {

      let result = await sails.helpers.roles.checkPermission.with({
        userId: player.user,
        serverId: sails.testServer.id,
        permission: field
      });
      return expect(result.hasPermission).to.be.eq(true);
    });
    return Promise.all(promises);
  });
  it(`Correctly checks if a user has the correct permission for the player role via player ID`, async function () {
    let playerRole = testRoles.filter(r => r.name === 'Player')[0];
    let player = await mockPlayer({
      roleId: playerRole.id
    });
    let promises = permissionFields.map(async function (field) {

      let result = await sails.helpers.roles.checkPermission.with({
        serverId: sails.testServer.id,
        playerId: player.id,
        permission: field
      });

      return expect(result.hasPermission).to.be.eq(false);
    });
    return Promise.all(promises);
  });

  it(`Correctly checks if a user has the correct permission for the admin role via user ID`, async function () {
    let playerRole = testRoles.filter(r => r.name === 'Admin')[0];
    let player = await mockPlayer({
      roleId: playerRole.id
    });
    let promises = permissionFields.map(async function (field) {

      let result = await sails.helpers.roles.checkPermission.with({
        serverId: sails.testServer.id,
        playerId: player.id,
        permission: field
      });

      return expect(result.hasPermission).to.be.eq(true);
    });
    return Promise.all(promises);
  });

  it(`Defaults to the highest level role if no default is set`, async function () {
    const player = await mockPlayer({});
    const defaultRole = testRoles.filter(r => r.name === 'Default')[0];
    await Role.destroy({
      id: defaultRole.id
    });
    const highestLevelRole = await Role.find({
      where: {
        server: sails.testServer.id,
      },
      sort: 'level DESC',
      limit: 1
    });
    const result = await sails.helpers.roles.checkPermission.with({
      serverId: sails.testServer.id,
      playerId: player.id,
      permission: 'manageServer'
    });

    expect(result.role).to.deep.eq(highestLevelRole[0]);
  });

  it('Defaults to the default role if one is set', async function () {
    const player = await mockPlayer({});
    const defaultRole = testRoles.filter(r => r.name === 'Default')[0];

    const result = await sails.helpers.roles.checkPermission.with({
      serverId: sails.testServer.id,
      playerId: player.id,
      permission: 'manageServer'
    });

    expect(result.role).to.deep.eq(defaultRole);

  });

  it('Returns false when a player with a role on another server tries to access', async function () {
    let otherRoles = OtherServerRoles.map(role => Role.create(role).fetch());
    otherRoles = await Promise.all(otherRoles);
    let checks = otherRoles.map(async function (role) {
      await role;
      testRoles.push(role);
      const player = await mockPlayer({
        roleId: role.id,
        serverId: role.server
      });
      return Promise.all(permissionFields.map(async permissionField => {

        const result = await sails.helpers.roles.checkPermission.with({
          serverId: sails.testServer.id,
          playerId: player.id,
          permission: permissionField
        });
        expect(result.hasPermission).to.deep.eq(false);
      }));
    });

    return Promise.all(checks);
  });

  describe('Caching', () => {
    it('Caches when playerId is given', async () => {
      const spy = sandbox.spy( sails.helpers.sdtd, 'getPlayerRole');
      // First do a normal run of checks

      let playerRole = testRoles.filter(r => r.name === 'Player')[0];
      let player = await mockPlayer({
        roleId: playerRole.id
      });
      let promises = permissionFields.map(async function (field) {

        let result = await sails.helpers.roles.checkPermission.with({
          serverId: sails.testServer.id,
          playerId: player.id,
          permission: field
        });

        return expect(result.hasPermission).to.be.eq(false);
      });
      await Promise.all(promises);
      expect(spy).to.have.callCount(permissionFields.length);

      // Now do another run, these should all be cached

      promises = permissionFields.map(async function (field) {

        let result = await sails.helpers.roles.checkPermission.with({
          serverId: sails.testServer.id,
          playerId: player.id,
          permission: field
        });

        return expect(result.hasPermission).to.be.eq(false);
      });
      await Promise.all(promises);
      expect(spy).to.have.callCount(permissionFields.length);


    });
    it('Caches when userId and serverId are given', async () => {
      const spy = sandbox.spy( sails.helpers.roles, 'getUserRole');

      // First, a normal run
      let playerRole = testRoles.filter(r => r.name === 'Admin')[0];
      let player = await mockPlayer({
        roleId: playerRole.id
      });
      let promises = permissionFields.map(async function (field) {

        let result = await sails.helpers.roles.checkPermission.with({
          userId: player.user,
          serverId: sails.testServer.id,
          permission: field
        });
        return expect(result.hasPermission).to.be.eq(true);
      });
      await Promise.all(promises);
      expect(spy).to.have.callCount(permissionFields.length);

      // After that, the same run again but now they should be cached
      promises = permissionFields.map(async function (field) {

        let result = await sails.helpers.roles.checkPermission.with({
          userId: player.user,
          serverId: sails.testServer.id,
          permission: field
        });
        return expect(result.hasPermission).to.be.eq(true);
      });
      await Promise.all(promises);
      expect(spy).to.have.callCount(permissionFields.length);

    });

  });

});

async function mockPlayer({
  roleId,
  steamId,
  userId,
  serverId,
}) {
  let createdUser = await User.create({
    steamId: faker.datatype.uuid(),
    username: faker.internet.userName()
  }).fetch();

  let createdPlayer = await Player.create({
    steamId: steamId ? steamId : createdUser.steamId,
    name: faker.internet.userName(),
    server: serverId ? serverId : sails.testServer.id,
    user: userId ? userId : createdUser.id,
    role: roleId,
  }).fetch();
  testPlayers.push(createdPlayer);
  return createdPlayer;
}
