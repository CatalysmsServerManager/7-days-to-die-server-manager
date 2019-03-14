const sevenDays = require('7daystodie-api-wrapper');

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
          loggingEnabled: true
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

          if (eventType === 'logLine') {
            let serverLogLineHooks = this.logLineHooks.get(String(serverId));
            for (const serverLogLineHook of serverLogLineHooks) {
              await executeLogLineHook(eventData, serverLogLineHook, serverId);
            }
            return;
          }

          let configuredHooks = await CustomHook.find({
            server: serverId,
            event: eventType
          });

          for (const hookToExec of configuredHooks) {
            await executeHook(eventData, hookToExec, serverId);
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

    let stringFound = checkLogLine(eventData.msg, hookToExec);

    if (stringFound) {
      let server = await SdtdServer.findOne(serverId);

      let results = await sails.helpers.sdtd.executeCustomCmd(server, hookToExec.commandsToExecute.split(';'), eventData);
      sails.log.debug(`Executed a custom logLine hook for server ${serverId}`, {
        hook: hookToExec,
        event: eventData,
        results: results
      });
    }

    // Checks if the logline matches the searchString or regex
    function checkLogLine(logLine, hook) {

      let useSearchString;

      if (!_.isEmpty(hook.searchString)) {
        useSearchString = true;
      }

      if (!_.isEmpty(hook.regex)) {
        useSearchString = false;
      }

      if (useSearchString) {
        return logLine.includes(hook.searchString);
      } else {
        return (new RegExp(hook.regex)).test(logLine);
      }
    }
  }
};
