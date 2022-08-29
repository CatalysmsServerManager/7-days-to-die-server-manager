const connected = require('./connected');
const connectionLost = require('./connectionLost');
const countrybanKick = require('./countrybanKick');
const cronJob = require('./cronJob');
const gblMaxBans = require('./gblMaxBans');
const playerConnected = require('./playerConnected');
const playerDisconnected = require('./playerDisconnected');
const systemBoot = require('./systemBoot');
const ticket = require('./ticket');
const sseThrottled = require('./SSEThrottled');


module.exports = [
  new connected(),
  new connectionLost(),
  new countrybanKick(),
  new cronJob(),
  new gblMaxBans(),
  new playerConnected(),
  new playerDisconnected(),
  new systemBoot(),
  new ticket(),
  new sseThrottled(),
];
