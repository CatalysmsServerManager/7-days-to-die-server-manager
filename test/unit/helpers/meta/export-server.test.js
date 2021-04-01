const { expect } = require('chai');
const fs = require('fs');
const path = require('path');

describe('HELPER Export server', function () {
  const importPaths = path.join(__dirname, 'test-imports', 'valid');
  const testImportFiles = fs.readdirSync(importPaths);

  before(() => {
    for (const file of testImportFiles) {
      sanitizeJson(path.join(__dirname, 'test-imports', 'valid', file));
    }
  });

  for (const file of testImportFiles) {
    it(`Can export "${file}"`, async function () {
      const data = fs.readFileSync(path.join(__dirname, 'test-imports', 'valid', file), 'utf-8');
      const server = await sails.helpers.meta.importServer(data);
      const result = await sails.helpers.meta.exportServer(server.id);
      expect(result.server.name).to.be.equal(server.name);
      // Some test imports have players, some dont
      if (result.players.length) {
        for (const player of result.players) {
          expect(player).to.not.haveOwnProperty('inventory');
          expect(player).to.not.haveOwnProperty('user');
        }
      }
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
