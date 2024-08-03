const enrichEventData = require('../../../api/hooks/sdtdLogs/enrichers');
const hooksCache = require('../../../api/hooksCache');


module.exports = async function hooks(job) {
  sails.log.debug(`[Worker] Got a \`hooks\` job of type ${job.data.type}`, { serverId: job.data.serverId });
  return handle(job.data);
};


async function handle({ data: eventData, type: eventType, server }) {
  // Set this prop so this data can be passed around easier
  eventData.server = server;

  // First we handle any 'logLine' events.
  if (eventType === 'logLine') {
    const serverLogLineHooks = await hooksCache.get(server.id, 'logLine');

    for (const serverLogLineHook of serverLogLineHooks) {
      const stringFound = checkLogLine(`${eventData.time} ${eventData.date} ${eventData.msg}`, serverLogLineHook);

      if (stringFound) {
        sails.log.debug(`Found the string! Executing hook ${serverLogLineHook.id}`, { server });
        const isNotOnCooldown = await handleCooldown(serverLogLineHook);
        if (isNotOnCooldown) {
          const variables = await getHookVariables(serverLogLineHook.id);
          serverLogLineHook.variables = variables;
          await executeLogLineHook(eventData, serverLogLineHook, server.id);
        }
      }
    }
    return;
  }

  // Handle any built-in events
  const configuredHooks = await hooksCache.get(server.id, eventType);

  for (const hookToExec of configuredHooks) {
    const isNotOnCooldown = await handleCooldown(hookToExec);
    const stringFound = checkLogLine(`${eventData.time} ${eventData.date} ${eventData.msg}`, hookToExec);
    if (stringFound) {
      if (isNotOnCooldown) {
        const variables = await getHookVariables(hookToExec.id);
        hookToExec.variables = variables;
        await executeHook(eventData, hookToExec, server.id, eventType);
      }
    }
  }
}



async function executeHook(eventData, hookToExec, serverId, eventType = 'logLine') {
  let server = await SdtdServer.findOne(serverId);
  eventData.server = server;
  eventData.type = eventType;
  eventData = await enrichEventData(eventData);

  // Ugly hack to work around some data inconsistency
  // When a hook fires, Allocs hasnt always updated internal data yet
  // So API requests get stale data back
  if (eventType === 'playerLevel' && eventData.player) {
    eventData.player.level = eventData.newLvl;
  }

  eventData.custom = getVariablesValues(hookToExec.variables, eventData.msg);
  let results = await sails.helpers.sdtd.executeCustomCmd(server, hookToExec.commandsToExecute, eventData);
  await saveResultsToRedis(hookToExec.id, results);
  sails.log.debug(`Executed a custom hook for server ${serverId}`, {
    hook: hookToExec,
    event: eventData,
    results: results,
    serverId
  });
}

async function executeLogLineHook(eventData, hookToExec, serverId) {

  // Ignore log messages created by the web API. This is the prevent spam
  if (eventData.msg.includes('WebCommandResult_for_')) {
    return;
  }

  let server = await SdtdServer.findOne(serverId);
  eventData.server = server;
  eventData = await enrichEventData(eventData);
  eventData.custom = getVariablesValues(hookToExec.variables, eventData.msg);
  let results = await sails.helpers.sdtd.executeCustomCmd(server, hookToExec.commandsToExecute, eventData);
  await saveResultsToRedis(hookToExec.id, results);
  sails.log.debug(`Executed a custom logLine hook for server ${serverId}`, {
    hook: hookToExec,
    event: eventData,
    results: results,
    serverId
  });
}


// Checks if the logline matches the searchString or regex
function checkLogLine(logLine, hook) {
  let logLineMatchesSearch = true;

  if (!_.isEmpty(hook.searchString)) {
    if (!hook.caseSensitive) {
      logLine = logLine.toLowerCase();
      hook.searchString = hook.searchString.toLowerCase();
    }

    logLineMatchesSearch = logLine.includes(hook.searchString);
  }

  if (!_.isEmpty(hook.regex)) {
    let regex;
    if (!hook.caseSensitive) {
      regex = new RegExp(hook.regex, 'i');
    } else {
      regex = new RegExp(hook.regex);
    }

    logLineMatchesSearch = regex.test(logLine);
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


async function getHookVariables(hookId) {
  let variables = await HookVariable.find({
    hook: hookId
  });
  return variables;
}

function getVariablesValues(variables, logMsg) {
  const customVars = {};

  for (const variable of variables) {
    const regex = new RegExp(variable.regex);
    let matches = logMsg.match(regex);
    if (!_.isNull(matches)) {
      customVars[variable.name] = logMsg.match(regex)[0];
    }
  }
  return customVars;
}

async function saveResultsToRedis(hookId, results) {
  await sails.helpers.redis.set(`hooks:${hookId}:lastResult`, JSON.stringify(results));
  return;
}
