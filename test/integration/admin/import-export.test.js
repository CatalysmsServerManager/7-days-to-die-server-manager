const supertest = require('supertest');
const { expect } = require('chai');
const path = require('path');

const fs = require('fs');


describe('Import export', function () {
  const dirPath = '../../unit/helpers/meta/test-imports';
  const validPaths = path.join(__dirname, dirPath, 'valid');
  //const invalidPaths = path.join(__dirname, dirPath, 'invalid');
  const testImportFilesValid = fs.readdirSync(validPaths);
  //const testImportFilesInvalid = fs.readdirSync(invalidPaths);


  for (const fileName of testImportFilesValid) {
    const filePath = path.join(__dirname, dirPath, 'valid', fileName);
    const file = fs.readFileSync(filePath).toString();
    it('Should import a server', async function () {
      const response = await supertest(sails.hooks.http.app)
        .post('/api/admin/import')
        .field('userId', sails.testUser.id)
        .attach('file', filePath);

      expect(response.statusCode).to.equal(200);
      expect(response.body.name).to.equal(JSON.parse(file).server.name);
    });
  }

  it('Error with invalid params', async function () {
    const response = await supertest(sails.hooks.http.app)
      .post('/api/admin/import')
      .field('userId', sails.testUser.id);


    expect(response.statusCode).to.equal(400);
    expect(response.body).to.deep.equal('No files uploaded');
  });


});

