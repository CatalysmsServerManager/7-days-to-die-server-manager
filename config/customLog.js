const winston = require('winston');

const logLevel = process.env.CSMM_LOGLEVEL || 'info';

const infoAndAbove = ['info', 'warn', 'blank', 'crit'];

const shouldLogJSON = JSON.parse((process.env.CSMM_LOG_JSON || 'false').toLowerCase());

const logDirectory = process.env.LOGGING_DIR ? process.env.LOGGING_DIR : './logs';

const simpleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.simple()
);


const transports = [
  new winston.transports.Console({
    level: logLevel,
    timestamp: true,
    humanReadableUnhandledException: true,
    format: shouldLogJSON ? winston.format.json() : simpleFormat,
  })
];

if (!process.env.DISABLE_LOG_FILE) {
  transports.push(new winston.transports.File({
    level: 'info',
    name: 'infolog',
    timestamp: true,
    humanReadableUnhandledException: false,
    filename: `${logDirectory}/prod.log`,
    tailable: true,
    maxsize: 1000000,
    maxFiles: 3,
    format: shouldLogJSON ? winston.format.json() : simpleFormat,
  }));
}


if (!infoAndAbove.includes(logLevel) && !process.env.DISABLE_LOG_FILE) {
  transports.push(
    new winston.transports.File({
      level: logLevel,
      name: 'debuglog',
      timestamp: true,
      humanReadableUnhandledException: true,
      filename: `${logDirectory}/debug.log`,
      tailable: true,
      maxsize: 1000000,
      maxFiles: 5,
      format: shouldLogJSON ? winston.format.json() : simpleFormat
    })
  );
}

const customLogger = new winston.createLogger({
  transports: transports,
});

customLogger.stream = {
  write: function (message) {
    customLogger.info(message);
  }
};

module.exports.customLogger = customLogger;
