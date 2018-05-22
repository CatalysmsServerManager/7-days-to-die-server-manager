/**
 * Built-in Log Configuration
 * (sails.config.log)
 *
 * Configure the log level for your app, as well as the transport
 * (Underneath the covers, Sails uses Winston for logging, which
 * allows for some pretty neat custom transports/adapters for log messages)
 *
 * For more information on the Sails logger, check out:
 * https://sailsjs.com/docs/concepts/logging
 */

// Load env vars
require('dotenv').config();

const winston = require('winston');

// var customLogger = new winston.Logger({
//   transports: [
//     new winston.transports.Console({
//       level: 'debug',
//       colorize: true,
//       timestamp: true,
//       humanReadableUnhandledException: true
//     }),
//     new winston.transports.File({
//       level: 'debug',
//       timestamp: true,
//       humanReadableUnhandledException: true,
//       filename: './logs/devlog.log',
//       tailable: true,
//       maxsize: 1000,
//       maxFiles: 3,
//       json: false,
//       colorize: true
//     })
//   ]
// });



// const { exec } = require('child_process');
// exec(`"node_modules/frontail/bin/frontail" -n 20 -t dark --ui-highlight ./logs/devlog.log`);


module.exports.log = {
  // Pass in our custom logger, and pass all log levels through.
  // custom: customLogger,

  // Disable captain's log so it doesn't prefix or stringify our meta data.
  // inspect: false
};
