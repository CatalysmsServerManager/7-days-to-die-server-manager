const os = require('os');

const winston = require('winston');
const LokiTransport = require('winston-loki');

const logLevel = process.env.CSMM_LOGLEVEL || 'info';

const infoAndAbove = ['info', 'warn', 'blank', 'crit'];

const shouldLogJSON = JSON.parse((process.env.CSMM_LOG_JSON || 'false').toLowerCase());
const disableFileLog = JSON.parse((process.env.DISABLE_LOG_FILE || 'false').toLowerCase());

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
  }),
];


if (process.env.LOKI_URL && process.env.LOKI_BASIC_AUTH) {
  transports.push(new LokiTransport({
    host: process.env.LOKI_URL,
    basicAuth: process.env.LOKI_BASIC_AUTH,
    level: logLevel,
    labels: {
      serverName: process.env.CSMM_HOSTNAME || os.hostname(),
      release: require('../package.json').version,
      script: process.env.npm_lifecycle_event || 'unknown',
    },
    format: winston.format.json(),
    batching: false,
    json: true
  }));
}

if (!disableFileLog) {
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


if (!infoAndAbove.includes(logLevel) && !disableFileLog) {
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
