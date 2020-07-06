const winston = require('winston');
const request = require('request');

const loadNs = process.hrtime();
const loadMs = new Date().getTime();

function nanoseconds() {
  const diffNs = process.hrtime(loadNs);
  const part2 = BigInt(diffNs[0]) * BigInt(1e9) + BigInt(diffNs[1]);
  return (BigInt(loadMs) * BigInt(1e6) + part2).toString();
}

function quote(str) {
  if (!str) {
    return str;
  }
  return `"${str.replace(/"/g, '"')}"`;
}

function errorToString(err) {
  if (err.stack) {
    return `message=${quote(err.message)},code=${quote(err.code)},stack=${quote(err.stack)}`;
  }
  return err.toString();
}

class LokiTransport extends winston.transports.Http {
  constructor(options) {
    super(options);
    this.lokiURL = options.lokiURL;
    this.labels = options.labels;
    this.labels.instance = this.labels.instance.replace(/https?:\/\//g, '').replace(/\//g, '');
  }

  _request(options, callback) {

    // handle errors
    if (options.params.meta instanceof Error) {
      options.params.message = options.params.message + errorToString(options.params.meta);
      options.params.meta = {
      };
    }
    options.params.meta.level = options.params.level;

    const config = {
      url: this.lokiURL,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'streams': [
          {
            'stream': {
              ...this.labels,
              level: options.params.level,
            },
            'values': [
              [
                nanoseconds(),
                `${options.params.message} ${JSON.stringify(options.params.meta)}`
                // `${options.params.level}: ${options.params.message}`
              ],
            ]
          }
        ]
      })
    };
    request(config, function (err, res, body) {
      if (err) {
        console.error({ err, body, config });
      }
      callback(err, res, body);
    });
  }
}


module.exports = LokiTransport;
