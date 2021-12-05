const supertest = require('supertest');
const chai = require('chai');
const expect = chai.expect;
const faker = require('faker');

const permissionFields = ['manageServer', 'manageEconomy', 'managePlayers', 'manageTickets', 'viewAnalytics', 'viewDashboard', 'useTracking', 'useChat', 'useCommands', 'manageGbl', 'discordExec', 'discordLookup'];
const testRoles = [];

chai.config.truncateThreshold = 0;

describe('PATCH /api/role', function () {

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

    await Promise.all(testRoles);
    return;

  });

  afterEach(async function () {
    await Role.destroy({
      id: testRoles.map(r => r.id)
    });
    testRoles.length = 0;
  });

  it('should return 200 with valid info', async function () {

    let promises = permissionFields.map(async function (field) {

      let data = {
        roleId: testRoles[0].id
      };
      data[field] = faker.datatype.boolean();

      return supertest(sails.hooks.http.app)
        .patch('/api/role')
        .send(data)
        .expect(200)
        .then(async function (response) {
          const newRole = await Role.findOne({
            id: response.body.id
          });
          expect(newRole[field]).to.deep.eq(data[field]);
        });
    });
    return Promise.all(promises);

  });

  it('should return 400 when no roleId is given', function (done) {
    supertest(sails.hooks.http.app)
      .patch('/api/role')
      .expect(400, done);
  });

  it('should change default role if one already exists', async function () {

    createdRole = await Role.create({
      server: sails.testServer.id,
      name: 'Default',
      level: '5000',
      isDefault: true
    }).fetch();
    testRoles.push(createdRole);

    return supertest(sails.hooks.http.app)
      .patch('/api/role')
      .send({
        roleId: testRoles[0].id,
        isDefault: true,
      })
      .expect(200)
      .then(async function () {
        const oldDefault = await Role.findOne({
          id: createdRole.id
        });
        expect(oldDefault.isDefault).to.be.deep.eq(false);
        const newDefault = await Role.findOne({
          id: testRoles[0].id
        });
        expect(newDefault.isDefault).to.deep.eq(true);
      });
  });

});
