const Redis = require('redis');
const dotenv = require('dotenv');
const promisify = require('util').promisify
const SdtdApi = require('7daystodie-api-wrapper');
const _ = require('lodash');

const handleLogLine = require('./handleLogLine');

/**
 * Set up Redis functionality
 */
dotenv.config();
const redisClient = Redis.createClient({
  url: process.env.REDISSTRING
});
redisClient.get = promisify(redisClient.get);
redisClient.set = promisify(redisClient.set);

module.exports = async function (job) {
  const startTime = Date.now();
  const resultLogs = [];
  // Get latest log line from Redis
  let lastLogLine = parseInt(await redisClient.get(`sdtdserver:${job.data.server.id}:sdtdLogs:lastLogLine`));

  // If latest log line is not found, get it from the server
  if (!lastLogLine) {
    const webUIUpdate = await SdtdApi.getWebUIUpdates(job.data.server);
    lastLogLine = parseInt(webUIUpdate.newlogs) + 1;
  }

  // Get new logs from the server
  const newLogs = await SdtdApi.getLog(job.data.server, lastLogLine, 1000);

  const timeToLogRequest = Date.now();

  // Adjust latest log line based on new logs we got
  lastLogLine = lastLogLine + newLogs.entries.length;

  // Set latest log line in Redis
  await redisClient.set(`sdtdserver:${job.data.server.id}:sdtdLogs:lastLogLine`, lastLogLine);

  // Parse these logs into usable data
  let index = -1;
  _.each(newLogs.entries, async line => {
    index++;
    if (newLogs.entries[index + 1]) {
      if (newLogs.entries[index + 1].msg.includes('handled by mod')) {
        //Message is being handled by a mod, skip to the next line with possibly mod-controlled data
        return;
      }
    }

    let parsedLogLine = handleLogLine(line);
    if (!_.isUndefined(parsedLogLine)) {
      parsedLogLine.server = job.data.server;
      resultLogs.push(parsedLogLine);
    }
  });

  // Set last success date in Redis
  await redisClient.set(`sdtdserver:${job.data.server.id}:sdtdLogs:lastSuccess`, Date.now());

  const timeToHandleLogs = Date.now();

  await redisClient.lpush("logRequestTimes", timeToLogRequest - startTime);
  await redisClient.lpush("logHandleTimes", timeToHandleLogs - timeToLogRequest);

  await redisClient.ltrim("logRequestTimes", 0, 1000);
  await redisClient.ltrim("logHandleTimes", 0, 1000);

  return Promise.resolve({
    lastLogLine,
    logs: resultLogs
  });
}
