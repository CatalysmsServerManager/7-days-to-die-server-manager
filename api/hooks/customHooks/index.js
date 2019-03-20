const sevenDays = require('7daystodie-api-wrapper');
const steam64Regex = new RegExp('[0-9]{17}');

module.exports = function defineCustomHooksHook(sails) {

  return {

    logLineHooks: new Map(),

    /**
     * Runs when a Sails app loads/lifts.
     *
     * @param {Function} done
     */
    initialize: async function (done) {

      sails.on('hook:sdtdlogs:loaded', async () => {

        sails.log.info('Initializing custom hooks');

        let enabledServers = await SdtdConfig.find({
          loggingEnabled: true,
          inactive: false,
        });

        let logLineHooks = await CustomHook.find({
          event: 'logLine'
        });

        let groupedLogLinesByServer = _.groupBy(logLineHooks, 'server');

        for (const server of Object.keys(groupedLogLinesByServer)) {
          this.logLineHooks.set(server, groupedLogLinesByServer[server]);
        }

        for (let config of enabledServers) {
          await this.start(config.server)
        }

        return;

      });

      return done();
    },

    start: async function (serverId) {
      let loggingObject = sails.hooks.sdtdlogs.getLoggingObject(serverId);

      for (const eventType of sails.config.custom.supportedHooks) {

        loggingObject.on(eventType, async eventData => {
          // First we handle any 'logLine' events.
          if (eventType === 'logLine') {
            let serverLogLineHooks = this.logLineHooks.get(String(serverId));

            if (_.isUndefined(serverLogLineHooks)) {
              serverLogLineHooks = [];
            }

            for (const serverLogLineHook of serverLogLineHooks) {
              let stringFound = checkLogLine(`${eventData.time} ${eventData.date} ${eventData.msg}`, serverLogLineHook);

              if (stringFound) {
                let isNotOnCooldown = await handleCooldown(serverLogLineHook);
                if (isNotOnCooldown) {
                  try {
                    await executeLogLineHook(eventData, serverLogLineHook, serverId);
                  } catch (error) {
                    sails.log.warn(`Error while executing a custom hook - ${error}`, {
                      eventData,
                      serverLogLineHook
                    });
                  }
                }
              }
            }
            return;
          }
          // Handle any built-in events
          let configuredHooks = await CustomHook.find({
            server: serverId,
            event: eventType
          });

          for (const hookToExec of configuredHooks) {
            const isNotOnCooldown = await handleCooldown(hookToExec);
            const stringFound = checkLogLine(`${eventData.time} ${eventData.date} ${eventData.msg}`, hookToExec);
            if (stringFound) {
              if (isNotOnCooldown) {
                try {
                  await executeHook(eventData, hookToExec, serverId);
                } catch (error) {
                  sails.log.warn(`Error while executing a custom hook - ${error}`, {
                    eventData,
                    hookToExec
                  });
                }
              }
            }
          }
        });
      }

      sails.log.debug(`Started customHooks module for server ${serverId}`)

    },

  };

  async function executeHook(eventData, hookToExec, serverId) {
    try {
      let server = await SdtdServer.findOne(serverId);

      let results = await sails.helpers.sdtd.executeCustomCmd(server, hookToExec.commandsToExecute.split(';'), eventData);
      sails.log.debug(`Executed a custom hook for server ${serverId}`, {
        hook: hookToExec,
        event: eventData,
        results: results
      });
    } catch (error) {
      sails.log.error(error);
    }
  }

  async function executeLogLineHook(eventData, hookToExec, serverId) {

    // Ignore log messages created by the web API. This is the prevent spam
    if (eventData.msg.includes('WebCommandResult_for_')) {
      return;
    }

    let server = await SdtdServer.findOne(serverId);
    // Try to find a steamID64 in the log message that we can link to a player.
    let possibleIds = findSteamIdFromString(eventData.msg);
    if (possibleIds.length === 1) {
      let players = await Player.find({
        server: serverId,
        steamId: possibleIds[0]
      });
      eventData.player = players[0];
    }
    let results = await sails.helpers.sdtd.executeCustomCmd(server, hookToExec.commandsToExecute.split(';'), eventData);
    sails.log.debug(`Executed a custom logLine hook for server ${serverId}`, {
      hook: hookToExec,
      event: eventData,
      results: results
    });
  }
};

/**
 * @param {String} logLineMessage
 * @returns {Array} An array of strings that matches the steam64 regex
 */
function findSteamIdFromString(logLineMessage) {
  let possibleIds = steam64Regex.exec(logLineMessage);

  if (!_.isArray(possibleIds)) {
    possibleIds = [];
  }

  return possibleIds;
}

// Checks if the logline matches the searchString or regex
function checkLogLine(logLine, hook) {
  let logLineMatchesSearch = true;

  if (!_.isEmpty(hook.searchString)) {
    logLineMatchesSearch = logLine.includes(hook.searchString)
  }

  if (!_.isEmpty(hook.regex)) {
    logLineMatchesSearch = (new RegExp(hook.regex)).test(logLine)
  }

  return logLineMatchesSearch;
}

/**
 * 
 * @param {Object} hook The hook that is being executed
 * @returns {boolean} true: okay to execute, false: hook is still on cooldown
 */
async function handleCooldown(hook) {
  if (hook.cooldown) {
    let lastExecutionTime = await sails.helpers.redis.get(`hooks:${hook.id}:lastExecutionTime`);

    if (_.isNull(lastExecutionTime)) {
      lastExecutionTime = 0;
    }

    lastExecutionTime = parseInt(lastExecutionTime);

    let currentTime = Date.now();

    if (lastExecutionTime + hook.cooldown > currentTime) {
      return false;
    } else {
      await sails.helpers.redis.set(`hooks:${hook.id}:lastExecutionTime`, currentTime);
      return true;
    }
  } else {
    return true;
  }
}
