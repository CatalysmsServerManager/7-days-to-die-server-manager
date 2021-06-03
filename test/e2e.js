const {upAll, logs} = require('docker-compose');
const path = require('path');
const wait = require('../worker/util/wait').wait;
const fetch = require('node-fetch');
const assert = require('assert/strict');

const composeOpts = { cwd: path.join(__dirname), log: true };

async function main() {
  await upAll(composeOpts);
  console.log('Waiting 60 seconds for everything to initialize');
  await countdown(60);
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
