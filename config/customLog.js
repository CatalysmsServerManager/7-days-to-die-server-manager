const winston = require("winston");

const logLevel = process.env.CSMM_LOGLEVEL;

if (logLevel !== "debug" && logLevel !== "info") {
  throw new Error(`Invalid log level given, please select "debug" or "info"`);
}

const transports = [
  new winston.transports.File({
    level: "info",
    name: "infolog",
    timestamp: true,
    humanReadableUnhandledException: false,
    filename: "./logs/prod.log",
    tailable: true,
    maxsize: 10000000,
    maxFiles: 3,
    json: false,
    colorize: false
  })
];

if (logLevel === "debug") {
  transports.push(
    new winston.transports.Console({
      level: "debug",
      colorize: true,
      timestamp: true,
      humanReadableUnhandledException: true
    })
  );
  transports.push(
    new winston.transports.File({
      level: "debug",
      name: "debuglog",
      timestamp: true,
      humanReadableUnhandledException: true,
      filename: "./logs/debug.log",
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
  write: function(message) {
    customLogger.info(message);
  }
};

module.exports.customLogger = customLogger;
