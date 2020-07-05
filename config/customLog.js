const winston = require('winston');

const logLevel = process.env.CSMM_LOGLEVEL || 'info';

const infoAndAbove = ['info', 'warn', 'blank', 'crit'];

const transports = [
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
    colorize: false
  }),
  new winston.transports.Console({
    level: logLevel,
    colorize: true,
    timestamp: true,
    humanReadableUnhandledException: true
  })
];

if (!infoAndAbove.includes(logLevel)) {
  transports.push(
    new winston.transports.File({
      level: logLevel,
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
  );
}

const customLogger = new winston.Logger({
  transports: transports
});

customLogger.stream = {
  write: function (message) {
    customLogger.info(message);
  }
};

module.exports.customLogger = customLogger;
