const os = require('os');

const winston = require('winston');
const { format } = require('winston');
const LokiTransport = require('winston-loki');

const logLevel = process.env.CSMM_LOGLEVEL || 'info';

const infoAndAbove = ['info', 'warn', 'blank', 'crit'];

const shouldLogJSON = JSON.parse((process.env.CSMM_LOG_JSON || 'false').toLowerCase());
const disableFileLog = JSON.parse((process.env.DISABLE_LOG_FILE || 'false').toLowerCase());

const logDirectory = process.env.LOGGING_DIR ? process.env.LOGGING_DIR : './logs';

const handleInfo = format((info) => {
  if (!info.labels) { info.labels = {}; };

  try {
    if (info.userId) {
      info.labels.user = info.userId.toString();
      delete info.userId;
    }

    if (info.user) {
      info.labels.user = info.user.id.toString();
      delete info.user;
    }

    if (info.serverId) {
      info.labels.server = info.serverId.toString();
      delete info.serverId;
    }

    if (info.server) {
      info.labels.server = info.server.id.toString();
      delete info.server;
    }

    if (info.playerId) {
      info.labels.player = info.playerId.toString();
      delete info.playerId;
    }

    if (info.player) {
      info.labels.player = info.player.id.toString();
      delete info.player;
    }
  } catch (error) {
    sails.log.error(`Error while parsing log info`, {original: info, error});
  }

  return info;
});

const simpleFormat = winston.format.combine(
  handleInfo(),
  winston.format.colorize(),
  winston.format.simple()
);

const jsonFormat = winston.format.combine(
  handleInfo(),
  winston.format.json()
);


const transports = [
  new winston.transports.Console({
    level: logLevel,
    timestamp: true,
    humanReadableUnhandledException: true,
    format: shouldLogJSON ? jsonFormat : simpleFormat,
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
    format: jsonFormat,
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
    format: shouldLogJSON ? jsonFormat : simpleFormat,
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
      format: shouldLogJSON ? jsonFormat : simpleFormat
    })
  );
}

const customLogger = new winston.createLogger({
  transports: transports,

});

customLogger.stream = {
  write: function (message) {
    const parsed = JSON.parse(message);

    const userId = parsed.userId ? parsed.userId.toString() : undefined;
    const serverId = parsed.serverId ? parsed.serverId.toString() : undefined;
    const playerId = parsed.playerId ? parsed.playerId.toString() : undefined;
    const url = parsed.url.split('?')[0];

    customLogger.info(message,
      {
        labels: {
          user: userId,
          server: serverId,
          player: playerId,
          httpMethod: parsed.method,
          url: url,
          status: parsed['status-code'],
          type: 'http'
        }
      });
  }
};

module.exports.customLogger = customLogger;
