const replyTypes = require('./replyTypes');

module.exports = async function sendReplyToPlayer(server, player, type, data) {
  const replyObj = getReplyObj(type);

  if (!replyObj) {
    return sendMsg(server, type, player);
  } else {

    let message = await getMessage(server, replyObj);
    if (!data) {
      data = {};
    }
    data.server = server;
    data.player = player;
    message = await sails.helpers.sdtd.fillCustomVariables(message, data);
    return sendMsg(server, message, player);
  }
};

function getReplyObj(type) {
  return replyTypes.filter(r => r.type === type)[0];
}


async function getMessage(server, replyObj) {
  const response = await CommandReply.find({
    type: replyObj.type,
    server: server.id
  });
  if (response.length === 0) {
    return replyObj.default;
  }
  return response[0].reply;
}

async function sendMsg(server, message, player) {
  const { replyPrefix, replyServerName } = server.config;
  const cpmVersion = await sails.helpers.sdtd.checkCpmVersion(server.id);

  if (replyPrefix) {
    message = `${replyPrefix} ${message}`;
  }

  if (cpmVersion) {
    let serverName;
    if (replyServerName) {serverName = replyServerName;} else {serverName = 'CSMM';}
    command = `pm2 "${serverName}" ${player.entityId} "${message}"`;
  } else {
    command = `pm ${player.entityId} "${message}"`;
  }

  return sails.helpers.sdtdApi.executeConsoleCommand(SdtdServer.getAPIConfig(server), command);
}
