const replyTypes = require('./replyTypes');

module.exports = async function sendReplyToPlayer(server, player, type, data) {

  function getReplyObj(type) {
    return replyTypes.filter(r => r.type === type)[0];
  }

  async function getMessage(replyObj) {
    let response = await CommandReply.find({
      type: replyObj.type,
      server: server.id
    });
    if (response.length === 0) {
      return replyObj.default;
    }
    return response[0].reply;
  }
  const replyObj = getReplyObj(type);

  if (!replyObj) {
    return sendMsg(type);
  } else {

    let message = await getMessage(replyObj);
    if (!data) {
      data = {};
    }
    data.server = server;
    data.player = player;
    message = await sails.helpers.sdtd.fillCustomVariables(message, data);
    return sendMsg(message);
  }


  function sendMsg(message) {

    const { replyPrefix } = server.config;

    if (replyPrefix) {
      message = `${replyPrefix} ${message}`;
    }

    command = `pm ${player.steamId} "${message}"`;
    return sails.helpers.sdtdApi.executeConsoleCommand(SdtdServer.getAPIConfig(server), command);
  }
};
