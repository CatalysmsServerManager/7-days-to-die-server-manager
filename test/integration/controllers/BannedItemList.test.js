const supertest = require('supertest');
const { expect } = require('chai');

describe('BannedItemList', function () {

  it('getting without server id should error', async function () {
    const response = await supertest(sails.hooks.http.app).get('/api/sdtdserver/bannedItems');
    expect(response.body).to.deep.equal({
      code: 'E_MISSING_OR_INVALID_PARAMS',
      problems: ['"serverId" is required, but it was not defined.'],
      message: 'The server could not fulfill this request (`GET /api/sdtdserver/bannedItems`) due to 1 missing or invalid parameter.  **The following additional tip will not be shown in production**:  Tip: Check your client-side code to make sure that the request data it sends matches the expectations of the corresponding parameters in your server-side route/action.  Also check that your client-side code sends data for every required parameter.  Finally, for programmatically-parseable details about each validation error, `.problems`. (Just remember, any time you inject dynamic data into the HTML, be sure to escape the strings at the point of injection.)'
    });
    expect(response.statusCode).to.equal(400);
  });

  it('getting with server id, but no items, should return fine', async function () {
    const response = await supertest(sails.hooks.http.app).get(`/api/sdtdserver/bannedItems?serverId=${sails.testServer.id}`);
    expect(response.body).to.deep.equal([]);
    expect(response.statusCode).to.equal(200);
  });

  it('should return 400 when name or commandsToExecute is not given', async function () {

    let createdRole = await Role.create({
      server: sails.testServer.id,
      name: 'Admin',
      level: '1',
      manageServer: true
    }).fetch();
    await BannedItemTier.create({ command: 'say gotcha', role: createdRole.id, server: sails.testServer.id });

    let postResponse = await supertest(sails.hooks.http.app)
      .post('/api/sdtdserver/bannedItems/item')
      .send({
        serverId: sails.testServer.id,
        name: 'something',
      });
    expect(postResponse.body).to.deep.equal({
      'code': 'E_MISSING_OR_INVALID_PARAMS',
      'message': 'The server could not fulfill this request (`POST /api/sdtdserver/bannedItems/item`) due to 1 missing or invalid parameter.  **The following additional tip will not be shown in production**:  Tip: Check your client-side code to make sure that the request data it sends matches the expectations of the corresponding parameters in your server-side route/action.  Also check that your client-side code sends data for every required parameter.  Finally, for programmatically-parseable details about each validation error, `.problems`. (Just remember, any time you inject dynamic data into the HTML, be sure to escape the strings at the point of injection.)',
      'problems': [
        '"tier" is required, but it was not defined.'
      ]
    });
    expect(postResponse.statusCode).to.equal(400);

    postResponse = await supertest(sails.hooks.http.app)
      .post('/api/sdtdserver/bannedItems/item')
      .send({
        serverId: sails.testServer.id,
        tier: 1,
      });
    expect(postResponse.body).to.deep.equal({
      'code': 'E_MISSING_OR_INVALID_PARAMS',
      'message': 'The server could not fulfill this request (`POST /api/sdtdserver/bannedItems/item`) due to 1 missing or invalid parameter.  **The following additional tip will not be shown in production**:  Tip: Check your client-side code to make sure that the request data it sends matches the expectations of the corresponding parameters in your server-side route/action.  Also check that your client-side code sends data for every required parameter.  Finally, for programmatically-parseable details about each validation error, `.problems`. (Just remember, any time you inject dynamic data into the HTML, be sure to escape the strings at the point of injection.)',
      'problems': [
        '"name" is required, but it was not defined.'
      ]
    });
    expect(postResponse.statusCode).to.equal(400);

    postResponse = await supertest(sails.hooks.http.app)
      .post('/api/sdtdserver/bannedItems/item')
      .send({
        serverId: sails.testServer.id,
        tier: 1,
        name: 'something',
      });
    expect(postResponse.body).to.deep.equal({});
    expect(postResponse.statusCode).to.equal(200);

    const getResponse = await supertest(sails.hooks.http.app).get(`/api/sdtdserver/bannedItems?serverId=${sails.testServer.id}`);
    expect(getResponse.statusCode).to.equal(200);
    expect(getResponse.body).to.deep.equal([{ 'createdAt': 1588296005000, 'updatedAt': 1588296005000, 'id': 1, 'name': 'something', 'server': 1, 'tier': { 'createdAt': 1588296005000, 'updatedAt': 1588296005000, 'id': 1, 'command': 'say gotcha', 'server': 1, 'role': { 'createdAt': 1588296005000, 'updatedAt': 1588296005000, 'id': 1, 'name': 'Admin', 'level': 1, 'isDefault': false, 'amountOfTeleports': 5, 'radiusAllowedToExplore': 1000000, 'economyGiveMultiplier': 1, 'economyDeductMultiplier': 1, 'discordRole': null, 'manageServer': true, 'manageEconomy': false, 'managePlayers': false, 'manageTickets': false, 'viewAnalytics': false, 'viewDashboard': false, 'useTracking': false, 'useChat': false, 'useCommands': false, 'manageGbl': false, 'discordExec': false, 'discordLookup': false, 'immuneToBannedItemsList': false, 'server': 1 } } }]);
  });
});

