/**
 * This code can be used to see if a CSMM process is healthy or not
 * Used in Docker healthcheck
 */

const http = require('http');

const options = {
  host: 'localhost',
  port: '1337',
  timeout: 2000,
  path: '/health'
};

const request = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  if (res.statusCode === 200) {
    process.exit(0);
  }
  else {
    process.exit(1);
  }
});

request.on('error', function () {
  console.log('ERROR');
  process.exit(1);
});

request.end();
