const _ = require('lodash');

const extractIntegers = string => string.match(/\d*/g).join('');

const steamIdRegex = /\d{17}/g;


const a20DeathRegex = /PlayerSpawnedInWorld \(reason: Died, position: (?<x>[-\d]+), (?<y>[-\d]+), (?<z>[-\d]+)\): EntityID=(?<entityId>\d+), (PltfmId|PlayerID)='(?<platformId>[\d\w]+)', CrossId='(?<crossId>[\d\w]+)', OwnerID='Steam_(?<steamId>\d{17})', PlayerName='(?<playerName>.+)'/;
const preA20DeathRegex = /PlayerSpawnedInWorld \(reason: Died, position: (?<x>[-\d]+), (?<y>[-\d]+), (?<z>[-\d]+)\): EntityID=(?<entityId>\d+), PlayerID='(?<platformId>[\d\w]+)', OwnerID='(?<steamId>\d{17})', PlayerName='(?<playerName>.+)'/;

const connectedRegex = /(Player connected,)/;
const disconnectedRegex = /(Player disconnected: )/;

const joinedRegex = /(PlayerSpawnedInWorld \(reason: EnterMultiplayer, position:)/;

const newLevelRegex = /(made level \d*)/g;
const oldLevelRegex = /(was )\d*/g;

const entityKilledRegex = /(killed .*)/g;

const gmsgDeathRegex = /GMSG: Player '(\w+)' died/;
const gmsgPvPDeathRegex = /GMSG: Player (.+) killed by (.+)/;

const chatRegex = /Chat \(from '(?<steamId>[\w\d-]+)', entity id '(?<entityId>[-\d]+)', to '(?<channel>\w+)'\): '(?<playerName>.+)':(?<messageText>.+)/;

module.exports = logLine => {


  let returnValue = {
    type: 'logLine',
    data: logLine
  };

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
      date: logLine.date,
      time: logLine.time,
      uptime: logLine.uptime,
      msg: logLine.msg,
      fps: fpsIdx === -1 ? '' : splitLogLine[fpsIdx + 1],
      heap: heapIdx === -1 ? '' : splitLogLine[heapIdx + 1],
      chunks: chunksIdx === -1 ? '' : splitLogLine[chunksIdx + 1],
      zombies: zombiesIdx === -1 ? '' : splitLogLine[zombiesIdx + 1],
      entities: entitiesIdx === -1 ? '' : splitLogLine[entitiesIdx + 1],
      players: playersIdx === -1 ? '' : splitLogLine[playersIdx + 1],
      items: itemsIdx === -1 ? '' : splitLogLine[itemsIdx + 1],
      rss: rssIdx === -1 ? '' : splitLogLine[rssIdx + 1],
    };

    returnValue.type = 'memUpdate';
    returnValue.data = memUpdate;
  }

  if (chatRegex.test(logLine.msg)) {
    /*
    {
       date: '2018-11-20',
       time: '14:38:03',
       uptime: '2274.494',
       msg: 'Chat (from 'Steam_123456789', entity id '171', to 'Global'): 'Catalysm': $help',
       trace: '',
       type: 'Log'
    }
    */


    const { groups: { steamId, entityId,channel, playerName, messageText } } = chatRegex.exec(logLine.msg);

    const data = {
      date: logLine.date,
      time: logLine.time,
      uptime: logLine.uptime,
      msg: logLine.msg,
      steamId: steamId.replace('Steam_', ''),
      entityId,
      channel,
      playerName,
      messageText: messageText.trim()
    };

    // Filter out chatmessages that have been handled by some API mod already
    if ((data.steamId === '-non-player-' && data.playerName !== 'Server') || data.entityId === '-1') {
      returnValue.type = 'logLine';
      returnValue.data = data;
    } else {
      returnValue.type = 'chatMessage';
      returnValue.data = data;
    }
  }

  if (connectedRegex.test(logLine.msg)) {
    const steamIdMatches = /pltfmid=Steam_(\d{17})|steamid=(\d{17})/.exec(logLine.msg);
    const steamId = steamIdMatches[1] || steamIdMatches[2];
    const playerName = /name=(.+), (pltfmid=|steamid=)/.exec(logLine.msg)[1];
    const entityId = /entityid=(\d+)/.exec(logLine.msg)[1];
    const ip = /ip=([\d.]+)/.exec(logLine.msg)[1];

    let connectedMsg = {
      steamId,
      playerName,
      entityId,
      ip,
      date: logLine.date,
      time: logLine.time,
      uptime: logLine.uptime,
      msg: logLine.msg
    };

    const geoIpLookup = require('geoip-lite').lookup(connectedMsg.ip);
    connectedMsg.country = geoIpLookup ? geoIpLookup.country : null;

    returnValue.type = 'playerConnected';
    returnValue.data = connectedMsg;
  }

  // New player connects
  if (joinedRegex.test(logLine.msg)) {
    /*
    {
      "date": "2019-03-04",
      "time": "14:50:25",
      "uptime": "109.802",
      "msg": "PlayerSpawnedInWorld (reason: EnterMultiplayer, position: -81, 61, -10): EntityID=531, PlayerID='76561198028175941', OwnerID='76561198028175941', PlayerName='Catalysm'",
      "trace": "",
      "type": "Log"
    }
    */

    const steamIdMatches = /PltfmId='Steam_(\d{17})|PlayerID='(\d{17})/.exec(logLine.msg);
    const steamId = steamIdMatches[1] || steamIdMatches[2];
    const playerName = /PlayerName='(.+)'/.exec(logLine.msg)[1];
    const entityId = /EntityID=(\d+)/.exec(logLine.msg)[1];
    const ownerId = /OwnerID='(Steam_)?(\d+)/.exec(logLine.msg)[2];


    let joinMsg = {
      steamId,
      playerName,
      entityId,
      ownerId,
      date: logLine.date,
      time: logLine.time,
      uptime: logLine.uptime,
      msg: logLine.msg
    };

    returnValue.type = 'playerJoined';
    returnValue.data = joinMsg;
  }

  if (disconnectedRegex.test(logLine.msg)) {
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
    const steamIdMatches = /PltfmId='Steam_(\d{17})|PlayerID='(\d{17})/.exec(logLine.msg);
    const playerNameMatch = /PlayerName='(.+)'/.exec(logLine.msg);
    const entityIDMatch = /EntityID=(\d+)/.exec(logLine.msg);

    if (!steamIdMatches) {
      return returnValue;
    }

    const playerID = steamIdMatches[1] || steamIdMatches[2];
    const ownerID = /OwnerID='(Steam_)?(\d+)/.exec(logLine.msg)[2];

    let disconnectedMsg = {
      entityID: entityIDMatch ? entityIDMatch[1] : null,
      playerName: playerNameMatch ? playerNameMatch[1] : null,
      ownerID,
      playerID,
      date: logLine.date,
      time: logLine.time,
      uptime: logLine.uptime,
      msg: logLine.msg
    };

    returnValue.type = 'playerDisconnected';
    returnValue.data = disconnectedMsg;
  }

  if (a20DeathRegex.test(logLine.msg)) {
    /*
    {
      "date": "2017-11-14",
      "time": "14:50:49",
      "uptime": "133.559",
      "msg": "PlayerSpawnedInWorld (reason: Died, position: 2796, 68, -1452): EntityID=6454, PlayerID='76561198028175941', OwnerID='76561198028175941', PlayerName='Catalysm'",
      "trace": "",
      "type": "Log"
    }
    */

    const { groups: { steamId, entityId, playerName } } = a20DeathRegex.exec(logLine.msg);
    const deathMessage = {
      date: logLine.date,
      time: logLine.time,
      uptime: logLine.uptime,
      msg: logLine.msg,
      steamId,
      playerName,
      entityId
    };

    returnValue.type = 'playerDeath';
    returnValue.data = deathMessage;
  }

  if (preA20DeathRegex.test(logLine.msg)) {
    /*
    {
      "date": "2017-11-14",
      "time": "14:50:49",
      "uptime": "133.559",
      "msg": "PlayerSpawnedInWorld (reason: Died, position: 2796, 68, -1452): EntityID=6454, PlayerID='76561198028175941', OwnerID='76561198028175941', PlayerName='Catalysm'",
      "trace": "",
      "type": "Log"
    }
    */

    const { groups: { steamId, entityId, playerName } } = preA20DeathRegex.exec(logLine.msg);
    const deathMessage = {
      date: logLine.date,
      time: logLine.time,
      uptime: logLine.uptime,
      msg: logLine.msg,
      steamId,
      playerName,
      entityId
    };

    returnValue.type = 'playerDeath';
    returnValue.data = deathMessage;
  }

  if (logLine.msg.startsWith('[CSMM_Patrons]playerLeveled:')) {
    /*
    {
      "date": "2017-11-14",
      "time": "14:50:49",
      "uptime": "133.559",
      "msg": "[CSMM_Patrons]playerLeveled: Catalysm (76561198028175941) made level 6 (was 5)",
      or
              [CSMM_Patrons]playerLeveled: Catalysm (Steam_76561198028175941) made level 2 (was 1)
      "trace": "",
      "type": "Log"
    }
    */

    const steamId = logLine.msg.match(steamIdRegex)[0];
    const newLvl = extractIntegers(logLine.msg.match(newLevelRegex)[0]);
    const oldLvl = extractIntegers(logLine.msg.match(oldLevelRegex)[0]);


    lvlMessage = {
      date: logLine.date,
      time: logLine.time,
      uptime: logLine.uptime,
      msg: logLine.msg,
      steamId: steamId,
      newLvl: newLvl,
      oldLvl: oldLvl
    };

    returnValue.type = 'playerLevel';
    returnValue.data = lvlMessage;
  }

  if (logLine.msg.startsWith('[CSMM_Patrons]entityKilled:')) {
    /*
    {
      "date": "2017-11-14",
      "time": "14:50:49",
      "uptime": "133.559",
      "msg": "[CSMM_Patrons]entityKilled: Catalysm (76561198028175941) killed zombie zombieBoe",
      or
            [CSMM_Patrons]entityKilled: Catalysm (Steam_76561198028175941) killed zombie zombieYo with Dev: Instant Death Pistol
      "trace": "",
      "type": "Log"
    }
    */

    const entityInfo = logLine.msg.match(entityKilledRegex)[0].split(' ');

    killMessage = {
      date: logLine.date,
      time: logLine.time,
      uptime: logLine.uptime,
      msg: logLine.msg,
      steamId: logLine.msg.match(steamIdRegex)[0],
      entityClass: entityInfo[1],
      entityName: entityInfo[2]
    };

    if (killMessage.entityClass === 'zombie') {
      returnValue.type = 'zombieKilled';
    }

    if (killMessage.entityClass === 'animal') {
      returnValue.type = 'animalKilled';
    }

    returnValue.data = killMessage;
  }

  if (gmsgPvPDeathRegex.test(logLine.msg)) {
    /*
    {
      "date": "2017-11-14",
      "time": "14:50:49",
      "uptime": "133.559",
      "msg": "GMSG: Player 'Tricia' killed by 'Catalysm'",
      "trace": "",
      "type": "Log"
    }
    */

    let killMessage = logLine.msg.match(gmsgPvPDeathRegex);

    const victimName = killMessage[1].split('\'').join('');
    const killerName = killMessage[2].split('\'').join('');

    if (victimName === killerName) {
      suicideMessage = {
        date: logLine.date,
        time: logLine.time,
        uptime: logLine.uptime,
        msg: logLine.msg,
        playerName: victimName
      };

      returnValue.type = 'playerSuicide';
      returnValue.data = suicideMessage;
    } else {
      killMessage = {
        date: logLine.date,
        time: logLine.time,
        uptime: logLine.uptime,
        msg: logLine.msg,
        victimName: victimName,
        killerName: killerName
      };

      returnValue.type = 'playerKilled';
      returnValue.data = killMessage;
    }
  }

  if (gmsgDeathRegex.test(logLine.msg)) {
    /*
      GMSG: Player 'Catalysm' died
      GameMessage handled by mod 'CSMM Patrons': GMSG: Player 'Catalysm' killed by 'Catalysm'
    */

    const deathArray = logLine.msg.match(gmsgDeathRegex);
    const playerName = deathArray[1] || deathArray[2];
    const deathMessage = {
      date: logLine.date,
      time: logLine.time,
      uptime: logLine.uptime,
      msg: logLine.msg,
      playerName: playerName,
    };

    returnValue.type = 'playerDied';
    returnValue.data = deathMessage;
  }


  return returnValue;
};
