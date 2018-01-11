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

var winston = require('winston');
require('winston-papertrail').Papertrail;

var customLogger = new winston.Logger({
  level: 'debug',
  //format: winston.format.json(),
  transports: [
    new winston.transports.Console({
      level: 'silly'
    }),
    new winston.transports.Papertrail({
      host: process.env.PAPERTRAILHOST,
      port: process.env.PAPERTRAILPORT,
      colorize: true,
    })
  ]
});

module.exports.log = {
  // Pass in our custom logger, and pass all log levels through.
  custom: customLogger,
  level: 'silly',

  // Disable captain's log so it doesn't prefix or stringify our meta data.
  inspect: false
};
