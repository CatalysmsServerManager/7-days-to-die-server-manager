const {upMany, logs} = require('docker-compose/dist/v2');
const path = require('path');
const wait = require('../worker/util/wait').wait;
const fetch = require('node-fetch');
const assert = require('assert/strict');

const composeOpts = { cwd: path.join(__dirname), log: true };

async function main() {
  // First, start the datastores and migration containers
  await upMany(['csmm-migrations', 'db', 'cache'],composeOpts);

  console.log('Waiting 60 seconds for data stores to initialize');
  await countdown(60);
  // Once all data stores are initialized, we can start CSMM itself
  await upMany(['csmm-web', 'csmm-worker',],composeOpts);

  console.log('Waiting 15 seconds for CSMM to boot');
  await countdown(15);

  await logs(['csmm-web', 'csmm-worker', 'csmm-migrations', 'db', 'cache'],composeOpts);
  const response = await fetch('http://127.0.0.1:1337');
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

async function countdown(seconds) {
  if (seconds === 0) {return;}

  console.log(seconds);
  await wait(1);
  return countdown(seconds -1 );
}
