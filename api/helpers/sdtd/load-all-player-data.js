const SdtdApi = require('7daystodie-api-wrapper');
module.exports = {
  friendlyName: 'Load all player data',
  description: 'Load player information from a 7 Days to die server',
  inputs: {
    serverId: {
      type: 'number',
      required: true
    },

  },
  exits: {
    error: {
      friendlyName: 'error'
    },

  },

  fn: async function (inputs, exits) {


    let dateStarted = new Date();

    let server = await SdtdServer.findOne(inputs.serverId);
    let currentPlayers = await Player.find({
      server: server.id
    });

    let apiResult = await SdtdApi.getPlayerList({
      ip: server.ip,
      port: server.webPort,
      adminUser: server.authName,
      adminToken: server.authToken
    }, 100000000);

    let newPlayers = new Array();

    for (const potentialNewPlayer of apiResult.players) {
      let idx = _.findIndex(currentPlayers, (currentPlayer) => {
        return currentPlayer.steamId === potentialNewPlayer.steamid;
      });

      // New player, so we add to the newPlayers array with init data
      if (idx === -1) {
        let newPlayerData = {
          steamId: potentialNewPlayer.steamid,
          entityId: potentialNewPlayer.entityid,
          ip: potentialNewPlayer.ip,
          name: potentialNewPlayer.name ? potentialNewPlayer.name : 'Unknown',
          positionX: potentialNewPlayer.position.x,
          positionY: potentialNewPlayer.position.y,
          positionZ: potentialNewPlayer.position.z,
          lastOnline: potentialNewPlayer.lastonline,
          playtime: potentialNewPlayer.totalplaytime,
          banned: potentialNewPlayer.banned,
          server: server.id
        };
        newPlayers.push(newPlayerData);
      }

    }

    const uniqueBySteamId = _.uniqBy(newPlayers, 'steamId');
    await Player.createEach(uniqueBySteamId);

    let dateEnded = new Date();

    sails.log.debug(`load-all-player-data - Created ${newPlayers.length} new records out of ${apiResult.players.length} total players for server ${server.name} - Took ${dateEnded.valueOf() - dateStarted.valueOf()} ms`, { serverId: inputs.serverId });

    return exits.success(apiResult.players);


  },
};
