const supertest = require('supertest');
const { expect } = require('chai');

describe('API Saved teleports', function () {
  it('works with correct data', async function () {
    const response = await supertest(sails.hooks.http.app).post(`/api/sdtdserver/teleport`)
      .send({
        serverId: sails.testServer.id,
        name: 'test',
        x: 1,
        y: 2,
        z: 3
      });

    expect(response.body.name).to.be.equal('test');
    expect(response.body.x).to.be.equal(1);
    expect(response.body.y).to.be.equal(2);
    expect(response.body.z).to.be.equal(3);
    expect(response.statusCode).to.equal(200);

    const teleport = await SavedTeleport.findOne(response.body.id);
    expect(teleport).to.be.ok;

  });

  it('Respects required data', async function () {
    const response = await supertest(sails.hooks.http.app).post(`/api/sdtdserver/teleport`)
      .send({});

    expect(response.body).to.deep.equal({ code: 'E_MISSING_OR_INVALID_PARAMS',
      problems:
     [
       '"serverId" is required, but it was not defined.',
       '"x" is required, but it was not defined.',
       '"y" is required, but it was not defined.',
       '"z" is required, but it was not defined.',
       '"name" is required, but it was not defined.' ],
      message: 'The server could not fulfill this request (`POST /api/sdtdserver/teleport`) due to 5 missing or invalid parameters.  **The following additional tip will not be shown in production**:  Tip: Check your client-side code to make sure that the request data it sends matches the expectations of the corresponding parameters in your server-side route/action.  Also check that your client-side code sends data for every required parameter.  Finally, for programmatically-parseable details about each validation error, `.problems`. (Just remember, any time you inject dynamic data into the HTML, be sure to escape the strings at the point of injection.)' });
    expect(response.statusCode).to.equal(400);
  });

  it('Only allows alphanumeric names', async function () {
    const response = await supertest(sails.hooks.http.app).post(`/api/sdtdserver/teleport`)
      .send({
        serverId: sails.testServer.id,
        name: '#test',
        x: 1,
        y: 2,
        z: 3
      });
    expect(response.statusCode).to.equal(400);
    expect(response.body).to.deep.equal({ code: 'E_MISSING_OR_INVALID_PARAMS',
      problems: [ 'Invalid "name":\n  · Value (\'#test\') failed custom validation.' ],
      message: 'The server could not fulfill this request (`POST /api/sdtdserver/teleport`) due to 1 missing or invalid parameter.  **The following additional tip will not be shown in production**:  Tip: Check your client-side code to make sure that the request data it sends matches the expectations of the corresponding parameters in your server-side route/action.  Also check that your client-side code sends data for every required parameter.  Finally, for programmatically-parseable details about each validation error, `.problems`. (Just remember, any time you inject dynamic data into the HTML, be sure to escape the strings at the point of injection.)' });
  });


  it('Deletes a teleport', async function () {
    const addResponse = await supertest(sails.hooks.http.app).post(`/api/sdtdserver/teleport`)
      .send({
        serverId: sails.testServer.id,
        name: 'test',
        x: 1,
        y: 2,
        z: 3
      });

    expect(addResponse.body.name).to.be.equal('test');
    expect(addResponse.body.x).to.be.equal(1);
    expect(addResponse.body.y).to.be.equal(2);
    expect(addResponse.body.z).to.be.equal(3);
    expect(addResponse.statusCode).to.equal(200);

    const teleport = await SavedTeleport.findOne(addResponse.body.id);
    expect(teleport).to.be.ok;

    await supertest(sails.hooks.http.app).delete(`/api/sdtdserver/teleport`)
      .send({
        serverId: sails.testServer.id,
        id: teleport.id
      });

    const teleportAfter = await SavedTeleport.findOne(addResponse.body.id);
    expect(teleportAfter).to.not.be.ok;

  });

  it('Can get a list of teleports', async function () {
    await SavedTeleport.create({
      name: 'aaa',
      x: 1,
      y: 1,
      z: 1,
      server: sails.testServer.id
    });
    await SavedTeleport.create({
      name: 'bbb',
      x: 1,
      y: 1,
      z: 1,
      server: sails.testServer.id
    });


    const response = await supertest(sails.hooks.http.app)
      .get(`/api/sdtdserver/teleport`)
      .query({
        serverId: sails.testServer.id
      });

    expect(response.body).to.be.an('array');
    expect(response.body).to.have.length(2);
  });

});

