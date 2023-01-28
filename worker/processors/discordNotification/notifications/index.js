const connected = require('./connected');
const connectionLost = require('./connectionLost');
const countrybanKick = require('./countrybanKick');
const cronJob = require('./cronJob');
const gblMaxBans = require('./gblMaxBans');
const playerConnected = require('./playerConnected');
const playerDisconnected = require('./playerDisconnected');
const systemBoot = require('./systemBoot');
const sseThrottled = require('./SSEThrottled');
const ticket = require('./ticket');


module.exports = [
  new connected(),
  new connectionLost(),
  new countrybanKick(),
  new cronJob(),
  new gblMaxBans(),
  new playerConnected(),
  new playerDisconnected(),
  new systemBoot(),
  new sseThrottled(),
  new ticket()
];
