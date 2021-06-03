const {upAll, logs} = require('docker-compose');
const path = require('path');
const wait = require('../worker/util/wait').wait;
const fetch = require('node-fetch');
const assert = require('assert/strict');

const composeOpts = { cwd: path.join(__dirname), log: true };

async function main() {
  await upAll(composeOpts);
  console.log('Waiting 30 seconds for everything to initialize');
  await wait(30);
  const response = await fetch('http://127.0.0.1:1337');
  await logs(['csmm-web', 'csmm-worker', 'csmm-migrations', 'db', 'cache'],composeOpts);
  assert.equal(response.status, 200);
}


main()
  .then(res => {
    console.log(res);
    process.exit(0);
  })
  .catch(e => {
    console.error(e);
    process.exit(1);
  });

