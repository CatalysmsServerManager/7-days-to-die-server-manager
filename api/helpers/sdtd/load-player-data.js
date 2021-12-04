var he = require('he');

module.exports = {
  friendlyName: 'Load player data',
  description: 'Load player information from a 7 Days to die server',
  inputs: {
    serverId: {
      type: 'number',
      required: true
    },
    steamId: {
      type: 'string'
    },
    onlyOnline: {
      type: 'boolean',
      description: 'Should we only load info about online players?'
    },

    steamAvatar: {
      type: 'boolean',
      description: 'Wheter or not to load steam avatars of the player(s). Defaults to false'
    },

    inventory: {
      type: 'boolean',
      description: 'Whether to load inventory data or not. Defaults to true'
    }
  },
  exits: {
    error: {
      friendlyName: 'error'
    },
    playerNotFound: {
      friendlyName: 'Player not found',
      description: 'ID was given, but no player found on the server'
    }
  },

  fn: async function (inputs, exits) {

    try {
      let dateStarted = new Date();
      let server = await SdtdServer.findOne(inputs.serverId);
      let serverAvailable = await sails.helpers.sdtd.checkIfAvailable(server.id, true);

      if (!serverAvailable) {
        if (inputs.onlyOnline) {
          return exits.success([]);
        } else {
          let playerProfile = await Player.find({
            steamId: inputs.steamId,
            server: server.id
          });
          return exits.success(playerProfile);
        }
      }

      let playerList = await getPlayerList(server);

      if (_.isUndefined(inputs.inventory)) {
        inputs.inventory = true;
      }

      // If steam ID is given, filter the response. Allocs API currently doesn't support filtering at this stage
      if (inputs.steamId) {
        playerList.players = playerList.players.filter(player => {
          return player.steamid === inputs.steamId;
        });
        playerList.total = playerList.players.length;
        playerList.totalUnfiltered = playerList.players.length;
      }

      // if onlyOnline is true, we only load info about online players. We filter the array for that
      if (inputs.onlyOnline) {
        playerList.players = playerList.players.filter(player => {
          return player.online;
        });
        playerList.total = playerList.players.length;
        playerList.totalUnfiltered = playerList.players.length;
      }

      let playersToSend = new Array();

      for (const player of playerList.players) {

        let playerProfile = await findOrCreatePlayer(player, inputs.serverId);
        // Inventory & stats data is only available when a player is online, so we only load it then.
        let playerInventory;
        let steamAvatar;

        if (inputs.steamAvatar) {
          steamAvatar = await loadSteamAvatar(player.steamid);

        }
        if (player.online && inputs.inventory) {
          playerInventory = await loadPlayerInventory(player.steamid, server);
        }

        let updateObj = {
          lastOnline: player.lastonline,
          name: player.name ? he.encode(player.name) : 'Unknown',
          ip: player.ip,
          entityId: player.entityid,
          positionX: player.position.x,
          positionY: player.position.y,
          positionZ: player.position.z,
          playtime: player.totalplaytime,
          banned: player.banned
        };

        if (!_.isUndefined(playerInventory)) {
          playerInventory = _.omit(playerInventory, 'playername');
          updateObj.inventory = playerInventory;
        }

        if (!_.isUndefined(steamAvatar)) {
          updateObj.avatarUrl = steamAvatar;
        }

        // Update the player record
        playerProfile = await Player.update({
          id: playerProfile.id
        }, updateObj).fetch();


        if (player.online) {
          playerProfile[0].online = true;
        }

        playerProfile[0].role = await sails.helpers.sdtd.getPlayerRole(playerProfile[0].id);

        sails.log.verbose(`Loaded a player - ${playerProfile[0].id} - ${playerProfile[0].name} - server: ${server.name}`, { serverId: inputs.serverId, player: playerProfile[0] });
        playerProfile[0].name = he.decode(playerProfile[0].name);
        playersToSend.push(playerProfile[0]);
      }
      let dateEnded = new Date();

      if (playersToSend.length > 0) {
        sails.log.debug(`HELPER - loadPlayerData - Loaded player data for ${server.name}! Took ${dateEnded.valueOf() - dateStarted.valueOf()} ms - SteamId: ${inputs.steamId}`, { serverId: inputs.serverId });
      }
      return exits.success(playersToSend);


    } catch (error) {
      exits.error(error);
    }


  },
};

async function getPlayerList(server) {
  try {
    const response = await sails.helpers.sdtdApi.getPlayerList(SdtdServer.getAPIConfig(server)
    );
    return response;
  } catch (error) {
    return { players: [] };
  }
}


async function findOrCreatePlayer(player, serverId) {
  try {
    let foundOrCreatedPlayer = await Player.findOrCreate({
      server: serverId,
      steamId: player.steamid
    }, {
      steamId: player.steamid,
      server: serverId,
      entityId: player.entityid,
      lastOnline: player.lastonline,
      name: player.name ? he.encode(player.name) : 'Unknown',
      ip: player.ip,
    });
    return foundOrCreatedPlayer;
  } catch (error) {
    let foundPlayer = await Player.find({
      where: {
        server: serverId,
        steamId: player.steamid
      },
      limit: 1
    });
    return foundPlayer[0];
  }
}

async function loadPlayerInventory(steamId, server) {
  try {
    const response = await sails.helpers.sdtdApi.getPlayerInventory(SdtdServer.getAPIConfig(server), steamId);
    return response;
  } catch (error) {
    return undefined;
  }
}

function loadSteamAvatar(steamId) {
  let request = require('request-promise-native');
  return new Promise((resolve) => {
    request({
      uri: 'http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002',
      qs: {
        steamids: steamId,
        key: process.env.API_KEY_STEAM,
      },
      json: true
    }).then(async (response) => {
      let avatar = undefined;
      if (response.response.players[0]) {
        if (response.response.players[0].avatar) {
          avatar = response.response.players[0].avatar;
        }
        if (response.response.players[0].avatarfull) {
          avatar = response.response.players[0].avatarfull;
        }
        resolve(avatar);
      } else {
        resolve();
      }
    }).catch(async (error) => {
      sails.log.error(`HELPER - loadPlayerData:loadSteamAvatar ${error}`);
      resolve();
    });
  });
}
