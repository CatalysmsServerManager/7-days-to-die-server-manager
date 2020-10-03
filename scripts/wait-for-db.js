const { Sequelize } = require('sequelize');
const pWaitFor = require('p-wait-for');

const config = require('../sequelize.config.js');
const envConfig = config[process.env.NODE_ENV || 'development'];

const sequelize = new Sequelize(envConfig.url, { logging: false });

pWaitFor(
  () => sequelize.authenticate()
    .then(() => true)
    .catch((err) => { console.log(err.toString()); return false; }),
  {
    interval: 1000,
    timeout: 300000,
  }
).then(console.log, console.error);
