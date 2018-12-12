const expect = require("chai").expect;
const faker = require('faker');

let testRoles = [];
let testPlayers = [];



describe('HELPER roles/check-permission', () => {
  before(async function () {
    // Create some default roles
    let createdRole = await Role.create({
      server: sails.testServer.id,
      name: "test-Admin",
      level: "1",
      manageServer: true
    }).fetch();
    testRoles.push(createdRole);
    createdRole = await Role.create({
      server: sails.testServer.id,
      name: "test-Moderator",
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
      name: "test-Donator",
      level: "1000",
      economyGiveMultiplier: 1.25,
      amountOfTeleports: 5
    }).fetch();
    testRoles.push(createdRole);

    createdRole = await Role.create({
      server: sails.testServer.id,
      name: "test-Player",
      level: "2000",
      amountOfTeleports: 2
    }).fetch();
    testRoles.push(createdRole);


    for (let index = 0; index < 50; index++) {

      testPlayers.push(mockPlayer({}));
    }

    await Promise.all(testPlayers);
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
});

async function mockPlayer({
  steamId,
  serverId,
  userId
}) {
  let createdPlayer = await Player.create({
    steamId: steamId ? steamId : faker.random.number(),
    name: faker.internet.userName(),
    server: serverId ? serverId : sails.testServer.id,
    user: userId ? userId : sails.testUser.id
  }).fetch();
  return createdPlayer;
}
