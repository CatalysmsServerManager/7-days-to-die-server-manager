const winston = require('winston');

const customLogger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      level: 'debug',
      colorize: true,
      timestamp: true,
      humanReadableUnhandledException: true
    }),
    new winston.transports.File({
      level: 'info',
      name: 'infolog',
      timestamp: true,
      humanReadableUnhandledException: false,
      filename: './logs/prod.log',
      tailable: true,
      maxsize: 10000000,
      maxFiles: 3,
      json: false,
      colorize: false,
    }),
    new winston.transports.File({
      level: 'debug',
      name: 'debuglog',
      timestamp: true,
      humanReadableUnhandledException: true,
      filename: './logs/debug.log',
      tailable: true,
      maxsize: 10000000,
      maxFiles: 5,
      json: false,
      colorize: true
    })
  ]
});

customLogger.stream = {
  write: function (message) {
    customLogger.info(message);
  }
};

module.exports.customLogger = customLogger;
