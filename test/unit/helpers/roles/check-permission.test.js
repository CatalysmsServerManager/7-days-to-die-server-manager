const expect = require("chai").expect;
const faker = require('faker');
const permissionFields = ["manageServer", "manageEconomy", "managePlayers", "manageTickets", "viewAnalytics", "viewDashboard", "useTracking", "useChat", "useCommands", "manageGbl", "discordExec", "discordLookup"];

let testRoles = [];
let testPlayers = [];



describe('HELPER roles/check-permission', () => {
  before(async function () {
    // Create some default roles
    let createdRole = await Role.create({
      server: sails.testServer.id,
      name: "Admin",
      level: "1",
      manageServer: true
    }).fetch();
    testRoles.push(createdRole);
    createdRole = await Role.create({
      server: sails.testServer.id,
      name: "Moderator",
      level: "10",
      manageEconomy: true,
      managePlayers: true,
      manageTickets: true,
      viewAnalytics: true,
      viewDashboard: true,
      useTracking: true,
      useChat: true,
      manageGbl: true,
      discordLookup: true
    }).fetch();
    testRoles.push(createdRole);

    createdRole = await Role.create({
      server: sails.testServer.id,
      name: "Donator",
      level: "1000",
      economyGiveMultiplier: 1.25,
      amountOfTeleports: 5
    }).fetch();
    testRoles.push(createdRole);

    createdRole = await Role.create({
      server: sails.testServer.id,
      name: "Player",
      level: "2000",
      amountOfTeleports: 2
    }).fetch();
    testRoles.push(createdRole);

    await Promise.all(testRoles);
    return;

  });

  after(async function () {

    await Player.destroy({
      id: testPlayers.map(p => p.id)
    });
    await Role.destroy({
      id: testRoles.map(r => r.id)
    });
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
    let playerRole = testRoles.filter(r => r.name === "Player")[0];
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
    let playerRole = testRoles.filter(r => r.name === "Admin")[0];
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
    let playerRole = testRoles.filter(r => r.name === "Player")[0];
    let player = await mockPlayer({
      roleId: playerRole.id
    });
    let promises = permissionFields.map(async function (field) {

      let result = await sails.helpers.roles.checkPermission.with({
        playerId: player.id,
        permission: field
      });

      return expect(result.hasPermission).to.be.eq(false);
    });
    return Promise.all(promises);
  });

  it(`Correctly checks if a user has the correct permission for the admin role via user ID`, async function () {
    let playerRole = testRoles.filter(r => r.name === "Admin")[0];
    let player = await mockPlayer({
      roleId: playerRole.id
    });
    let promises = permissionFields.map(async function (field) {

      let result = await sails.helpers.roles.checkPermission.with({
        playerId: player.id,
        permission: field
      });

      return expect(result.hasPermission).to.be.eq(true);
    });
    return Promise.all(promises);
  });
});

async function mockPlayer({
  roleId,
  steamId,
  userId,
  serverId,
}) {
  if (!roleId) {
    throw new Error("Required parameter missing")
  }

  let createdUser = await User.create({
    steamId: faker.random.uuid(),
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
