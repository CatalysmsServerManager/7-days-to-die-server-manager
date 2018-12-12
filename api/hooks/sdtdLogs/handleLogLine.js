const geoip = require('geoip-ultralight');

module.exports = (logLine) => {

  let returnValue = {
    type: undefined,
    data: undefined
  }

  if (_.startsWith(logLine.msg, 'Time:')) {
    // {
    //     date: '2018-04-12',
    //     time: '22:01:21',
    //     uptime: '72067.431',
    //     msg: 'Time: 1200.60m FPS: 36.24 Heap: 769.5MB Max: 924.2MB Chunks: 361 CGO: 14 Ply: 1 Zom: 10 Ent: 11 (20) Items: 0 CO: 2 RSS: 1440.9MB',
    //     trace: '',
    //     type: 'Log'
    // }

    // Find the positions of the data points
    let splitLogLine = logLine.msg.split(' ');
    let fpsIdx = splitLogLine.indexOf('FPS:');
    let heapIdx = splitLogLine.indexOf('Heap:');
    let chunksIdx = splitLogLine.indexOf('Chunks:');
    let zombiesIdx = splitLogLine.indexOf('Zom:');
    let entitiesIdx = splitLogLine.indexOf('Ent:');
    let playersIdx = splitLogLine.indexOf('Ply:');
    let itemsIdx = splitLogLine.indexOf('Items:');
    let rssIdx = splitLogLine.indexOf('RSS:');

    let memUpdate = {
      fps: fpsIdx === -1 ? '' : splitLogLine[fpsIdx + 1],
      heap: heapIdx === -1 ? '' : splitLogLine[heapIdx + 1],
      chunks: chunksIdx === -1 ? '' : splitLogLine[chunksIdx + 1],
      zombies: zombiesIdx === -1 ? '' : splitLogLine[zombiesIdx + 1],
      entities: entitiesIdx === -1 ? '' : splitLogLine[entitiesIdx + 1],
      players: playersIdx === -1 ? '' : splitLogLine[playersIdx + 1],
      items: itemsIdx === -1 ? '' : splitLogLine[itemsIdx + 1],
      rss: rssIdx === -1 ? '' : splitLogLine[rssIdx + 1],
      uptime: logLine.uptime
    }

    returnValue.type = 'memUpdate';
    returnValue.data = memUpdate;

  }

  // A17 Chat
  if (_.startsWith(logLine.msg, 'Chat') && logLine.msg.includes("(from")) {
    /*
    { 
       date: '2018-11-20',
       time: '14:38:03',
       uptime: '2274.494',
       msg: 'Chat (from \'76561198028175941\', entity id \'171\', to \'Global\'): \'Catalysm\': blabla',
       trace: '',
       type: 'Log' 
    }
    */

    let splitMessage = logLine.msg.split('\'');

    if (logLine.msg.includes('Chat handled by mod')) {
      splitMessage = splitMessage.slice(2);
    }

    let data = {
      time: logLine.time,
      steamId: splitMessage[1],
      entityId: splitMessage[3],
      channel: splitMessage[5],
      playerName: splitMessage[7],
      messageText: splitMessage.slice(8).join(' ').replace(": ", "")
    };

    // Filter out chatmessages that have been handled by some API mod already
    if ((data.steamId === "-non-player-" && data.playerName !== 'Server') || data.entityId === "-1") {
      sails.log.debug(`Discarding chat message because it's not from a player`, data);
      return;
    }

    returnValue.type = 'chatMessage';
    returnValue.data = data;
  }

  // pre A17 chat
  if (_.startsWith(logLine.msg, 'Chat:')) {
    /*
    {
      "date": "2017-11-14",
      "time": "14:50:39",
      "uptime": "123.278",
      "msg": "Chat: 'Catalysm': hey",
      "trace": "",
      "type": "Log"
    }
    */

    let firstIdx = logLine.msg.indexOf('\'');
    let secondIdx = logLine.msg.indexOf('\'', firstIdx + 1)
    let playerName = logLine.msg.slice(firstIdx + 1, secondIdx)
    let messageText = logLine.msg.slice(secondIdx + 3, logLine.msg.length)

    let date = logLine.date
    let time = logLine.time
    let type = "chat"
    if (playerName == 'Server') {
      type = "server"
    }

    /*
    Workaround for when the server uses servertools roles
    Server tools 
    */
    if (playerName.includes('[-]') && playerName.includes("](")) {
      let roleColourDividerIndex = playerName.indexOf("](")
      let roleEndIndex = playerName.indexOf(")", roleColourDividerIndex);
      let newPlayerName = playerName.substring(roleEndIndex + 2).replace('[-]', '');
      playerName = newPlayerName;
    }

    /**
     * Workaround for coppi colours (with the colour ending indicator [-])
     */

    if (playerName.includes('[-]')) {
      let colourEndIdx = playerName.indexOf("]");
      let newPlayerName = playerName.substring(colourEndIdx + 1).replace('[-]', '');
      playerName = newPlayerName
    }

    let data = {
      playerName,
      messageText,
      type,
      date,
      time
    };

    returnValue.type = 'chatMessage';
    returnValue.data = data;
  }

  if (_.startsWith(logLine.msg, 'Player connected,')) {
    /*
            {
              "date": "2017-11-14",
              "time": "14:50:25",
              "uptime": "109.802",
              "msg": "Player connected, entityid=171, name=Catalysm, steamid=76561198028175941, steamOwner=76561198028175941, ip=::ffff:192.168.1.52",
              "trace": "",
              "type": "Log"
            }
    */

    let date = logLine.date
    let time = logLine.time
    let logMsg = logLine.msg.split(",")

    let entityID = logMsg[1].replace("entityid=", "").trim()
    let playerName = logMsg[2].replace("name=", "").trim()
    let steamID = logMsg[3].replace("steamid=", "").trim()
    let steamOwner = logMsg[4].replace("steamOwner=", "").trim()
    let ip = logMsg[5].replace("ip=", "").trim()
    let country = geoip.lookupCountry(ip);

    let connectedMsg = {
      entityID,
      playerName,
      steamID,
      steamOwner,
      ip,
      country,
      date,
      time
    };

    returnValue.type = "playerConnected";
    returnValue.data = connectedMsg;

  }
  if (_.startsWith(logLine.msg, 'Player disconnected:')) {
    /*
    {
      "date": "2017-11-14",
      "time": "14:51:40",
      "uptime": "184.829",
      "msg": "Player disconnected: EntityID=171, PlayerID='76561198028175941', OwnerID='76561198028175941', PlayerName='Catalysm'",
      "trace": "",
      "type": "Log"
    }
    */
    let date = logLine.date
    let time = logLine.time
    let logMsg = logLine.msg
    logMsg = logMsg.replace("Player disconnected", "")
    logMsg = logMsg.split(",")


    let entityID = logMsg[0].replace(": EntityID=", "").trim()
    let playerID = logMsg[1].replace("PlayerID=", "").replace(/'/g, "").trim()
    let ownerID = logMsg[2].replace("OwnerID=", "").replace(/'/g, "").trim()
    let playerName = logMsg[3].replace("PlayerName=", "").replace(/'/g, "").trim()

    let disconnectedMsg = {
      entityID,
      playerName,
      ownerID,
      playerID,
      date,
      time
    };

    returnValue.type = "playerDisconnected";
    returnValue.data = disconnectedMsg;

  }

  if (logLine.msg.includes("GMSG: Player") && logLine.msg.includes("died")) {
    /*
    {
      "date": "2017-11-14",
      "time": "14:50:49",
      "uptime": "133.559",
      "msg": "GMSG: Player 'Catalysm' died",
      "trace": "",
      "type": "Log"
    }
    */
    let deathMessage = logLine.msg.split(" ")
    let playerName = deathMessage.slice(2, deathMessage.length - 1).join(" ").replace("/'", "")
    let date = logLine.date
    let time = logLine.time
    deathMessage = {
      playerName,
      date,
      time
    }

    returnValue.type = "playerDeath";
    returnValue.data = deathMessage;
  }

  return returnValue;
};
