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

module.exports.log = {
  level: process.env.CSMM_LOGLEVEL || 'info',

  // Pass in our custom logger, and pass all log levels through.
  custom: require('./customLog').customLogger,

  //  Disable captain's log so it doesn't prefix or stringify our meta data.
  inspect: false
}
