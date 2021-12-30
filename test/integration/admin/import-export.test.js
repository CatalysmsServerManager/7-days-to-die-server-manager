const supertest = require('supertest');
const { expect } = require('chai');
const path = require('path');

const fs = require('fs');


describe('Import export', function () {
  const dirPath = '../../unit/helpers/meta/test-imports';
  const validPaths = path.join(__dirname, dirPath, 'valid');
  const invalidPaths = path.join(__dirname, dirPath, 'invalid');
  const testImportFilesValid = fs.readdirSync(validPaths);
  const testImportFilesInvalid = fs.readdirSync(invalidPaths);

  beforeEach(() => {
    sandbox.stub(sails.helpers.sdtd, 'checkModVersion').resolves(38);
    sails.config.custom.adminSteamIds = [sails.testUser.steamId];
  });

  for (const fileName of testImportFilesValid) {
    const filePath = path.join(__dirname, dirPath, 'valid', fileName);
    const file = fs.readFileSync(filePath).toString();
    it(`Should import a server "${fileName}"`, async function () {
      const response = await supertest(sails.hooks.http.mockApp)
        .post('/api/admin/import')
        .field('userId', sails.testUser.id)
        .attach('file', filePath);

      expect(response.statusCode).to.equal(200);
      expect(response.body.name).to.equal(JSON.parse(file).server.name);
    });
  }

  for (const fileName of testImportFilesInvalid) {
    const filePath = path.join(__dirname, dirPath, 'invalid', fileName);
    it(`Should gracefully exit "${fileName}"`, async function () {
      const response = await supertest(sails.hooks.http.mockApp)
        .post('/api/admin/import')
        .field('userId', sails.testUser.id)
        .attach('file', filePath);

      expect(response.statusCode).to.equal(400);
      expect(response.body).to.equal('Error while importing server, see logs for details');

    });
  }

  it('Error with invalid params', async function () {
    let response = await supertest(sails.hooks.http.mockApp)
      .post('/api/admin/import')
      .field('userId', sails.testUser.id);

    expect(response.statusCode).to.equal(400);
    expect(response.body).to.deep.equal('No files uploaded');
  });

  it('Can export files', async function () {

    const response = await supertest(sails.hooks.http.mockApp)
      .get(`/api/admin/export?serverId=${sails.testServer.id}`);

    expect(response.body.server.name).to.be.equal(sails.testServer.name);

  });


});

