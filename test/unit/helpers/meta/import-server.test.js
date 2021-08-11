const { expect } = require('chai');
const fs = require('fs');
const path = require('path');

describe('HELPER Import server', function () {
  const validPaths = path.join(__dirname, 'test-imports', 'valid');
  const invalidPaths = path.join(__dirname, 'test-imports', 'invalid');
  const testImportFilesValid = fs.readdirSync(validPaths);
  const testImportFilesInvalid = fs.readdirSync(invalidPaths);

  beforeEach(() => {
    sandbox.stub(sails.helpers.sdtd, 'checkModVersion').resolves(38);
  });

  before(() => {
    for (const file of testImportFilesValid) {
      sanitizeJson(path.join(__dirname, 'test-imports', 'valid', file));
    }
    for (const file of testImportFilesInvalid) {
      sanitizeJson(path.join(__dirname, 'test-imports', 'invalid', file));
    }
  });

  for (const file of testImportFilesValid) {
    it(`Can import the valid file: "${file}"`, async function () {
      const data = fs.readFileSync(path.join(__dirname, 'test-imports', 'valid', file), 'utf-8');
      await sails.helpers.meta.importServer(data);

      // TODO: Expect some data to be in the DB
    });
  }

  for (const file of testImportFilesInvalid) {
    it(`Errors for invalid file: "${file}"`, async function () {
      const data = fs.readFileSync(path.join(__dirname, 'test-imports', 'invalid', file), 'utf-8');
      await expect(sails.helpers.meta.importServer(data)).to.eventually.be.rejected;

    });
  }
});


function sanitizeJson(filePath) {
  console.log(`Sanitizing ${filePath}`);
  const data = fs.readFileSync(filePath, 'utf-8');
  let json;
  try {
    json = JSON.parse(data);
  } catch (error) {
    console.log('Its not valid JSON, cant sanitize this');
    console.log(error);
    return;
  }

  // Strip out authname and token
  if (json.server && json.server.authName) {
    json.server.authName = 'CSMM';
  }
  if (json.server && json.server.authToken) {
    json.server.authName = 'redacted';
  }

  // Strip out player IPs
  if (json.players) {
    json.players.map(p => {
      p.ip = 'Redacted';
      return p;
    });
  }

  fs.writeFileSync(filePath, JSON.stringify(json));
}
