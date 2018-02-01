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
require('winston-papertrail').Papertrail;



if (process.env.NODE_ENV == "production") {
  var customLogger = new winston.Logger({
    transports: [
      new winston.transports.Papertrail({
        host: process.env.PAPERTRAILHOST,
        port: process.env.PAPERTRAILPORT,
        colorize: true
      }),
      new winston.transports.Console({
        level: 'debug',
        colorize: true,
        timestamp: true,
        humanReadableUnhandledException: true
      })
    ]
  });

  customLogger.on('error', function (err) {
    console.log(`ERROR INITIALIZING PAPERTRAIL LOGGER ${err}`)
  });

}

if (process.env.NODE_ENV == "dev") {
  var customLogger = new winston.Logger({
    transports: [
      new winston.transports.Console({
        level: 'silly',
        colorize: true,
        timestamp: true,
        humanReadableUnhandledException: true
      })
    ]
  });

}






module.exports.log = {
  // Pass in our custom logger, and pass all log levels through.
  custom: customLogger,
  level: 'debug',

  // Disable captain's log so it doesn't prefix or stringify our meta data.
  inspect: false
};
