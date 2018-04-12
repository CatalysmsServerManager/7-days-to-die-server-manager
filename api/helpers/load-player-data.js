var sevenDays = require('machinepack-7daystodiewebapi');
const hhmmss = require('@streammedev/hhmmss');

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

  /**
   * @description Loads player information and saves it to database
   * @name loadPlayerData
   * @param {number} serverId
   * @memberof module:Helpers
   * @method
   */

  fn: async function (inputs, exits) {
    sails.log.verbose(`HELPER - loadPlayerData - Loading player data for server ${inputs.serverId} -- steamId: ${inputs.steamId}`);

    try {
      let server = await SdtdServer.findOne(inputs.serverId);
      let playerList = await getPlayerList(server);

      // If steam ID is given, filter the response. Allocs API currently doesn't support filtering at this stage
      if (inputs.steamId) {
        playerList.players = playerList.players.filter(player => {
          return player.steamid == inputs.steamId
        })
        playerList.total = playerList.players.length;
        playerList.totalUnfiltered = playerList.players.length;
      }

      if (playerList.players) {
        let playerListWithInventories = await loadPlayersInventory(playerList.players, server);
        let newPlayerList = await playerListWithInventories.map(await updatePlayerInfo);

        if (inputs.steamId) {
          await loadPlayerProfilePicture(inputs.steamId);
        }
        let playerStats = await sails.helpers.sdtd.loadPlayerStats(inputs.serverId);
        let jsonToSend = await createJSON(newPlayerList);
        sails.log.debug(`HELPER - loadPlayerData - Loaded player data for server ${inputs.serverId}! SteamId: ${inputs.steamId} - Found ${jsonToSend.totalPlayers} players`);
        exits.success(jsonToSend);
      } else {
        let jsonToSend = await createJSON(playerList);
        sails.log.debug(`HELPER - loadPlayerData - Loaded player data for server ${inputs.serverId}! SteamId: ${inputs.steamId} - Found ${jsonToSend.totalPlayers} players`);
        exits.success(jsonToSend);
      }


    } catch (error) {
      exits.error(error);
    }

    async function loadPlayersInventory(playerList, server) {
      return new Promise((resolve, reject) => {
        let listWithInventories = playerList.map(function (player) {
          return new Promise((resolve, reject) => {
            sevenDays.getPlayerInventory({
              ip: server.ip,
              port: server.webPort,
              authName: server.authName,
              authToken: server.authToken,
              steamId: player.steamid
            }).exec({
              error: function (err) {
                resolve(player);
              },
              success: function (data) {
                player.inventory = new Object();
                player.inventory.bag = data.bag;
                player.inventory.belt = data.belt;
                player.inventory.equipment = data.equipment;
                resolve(player);
              }
            });
          });
        });
        resolve(listWithInventories);
      });
    }

    async function updatePlayerInfo(newPlayer) {
      return new Promise(async function (resolve, reject) {
        try {
          newPlayer.then(async function (newPlayer) {
            if (newPlayer.name === '') {
              newPlayer.name = 'Unknown name';
            }
            foundOrCreatedPlayer = await Player.findOrCreate({
              steamId: newPlayer.steamid,
              server: inputs.serverId,
              entityId: newPlayer.entityid
            }, {
              steamId: newPlayer.steamid,
              server: inputs.serverId,
              entityId: newPlayer.entityid,
              lastOnline: newPlayer.lastonline,
              name: newPlayer.name,
              ip: newPlayer.ip,
            });
            if (newPlayer.online) {
              playerToSend = await Player.update({
                steamId: foundOrCreatedPlayer.steamId,
                server: inputs.serverId,
                entityId: foundOrCreatedPlayer.entityId
              }).set({
                ip: newPlayer.ip,
                positionX: newPlayer.position.x,
                positionY: newPlayer.position.y,
                positionZ: newPlayer.position.z,
                playtime: newPlayer.totalplaytime,
                lastOnline: newPlayer.lastonline,
                inventory: newPlayer.inventory,
                banned: newPlayer.banned,
              }).fetch();
            } else {
              playerToSend = await Player.update({
                steamId: foundOrCreatedPlayer.steamId,
                server: inputs.serverId,
                entityId: foundOrCreatedPlayer.entityId
              }).set({
                ip: newPlayer.ip,
                positionX: newPlayer.position.x,
                positionY: newPlayer.position.y,
                positionZ: newPlayer.position.z,
                lastOnline: newPlayer.lastonline,
                playtime: newPlayer.totalplaytime,
                banned: newPlayer.banned,
              }).fetch();
            }

            playerToSend = playerToSend[0];
            playerToSend.online = newPlayer.online;
            resolve(playerToSend);
          });
        } catch (error) {
          resolve(foundOrCreatedPlayer)
        }

      });
    }

    async function getPlayerList(server) {
      return new Promise((resolve, reject) => {

        if (inputs.onlyOnline) {
          sevenDays.getOnlinePlayers({
            ip: server.ip,
            port: server.webPort,
            authName: server.authName,
            authToken: server.authToken
          }).exec({
            error: function (err) {
              resolve({
                players: []
              });
            },
            success: function (playerList) {
              resolve(playerList);
            }
          });
        } else {
          sevenDays.getPlayerList({
            ip: server.ip,
            port: server.webPort,
            authName: server.authName,
            authToken: server.authToken
          }).exec({
            error: function (err) {
              resolve({
                players: []
              });
            },
            success: function (playerList) {
              resolve(playerList);
            }
          });
        }


      });
    }


    async function createJSON(playerList) {
      return new Promise(function (resolve) {
        try {
          let toSend = {};
          Promise.all(playerList).then(resolvedPlayers => {
            toSend.totalPlayers = playerList.length;
            toSend.players = new Array();
            resolvedPlayers.forEach(function (player) {
              let playerData = new Object();
              playerData.id = player.id;
              playerData.online = player.online;
              playerData.steamId = player.steamId;
              playerData.entityId = player.entityId;
              playerData.location = new Object();
              playerData.location.x = player.positionX;
              playerData.location.y = player.positionY;
              playerData.location.z = player.positionZ;
              playerData.inventory = player.inventory;
              playerData.totalPlaytime = player.playtime;
              playerData.lastOnline = player.lastOnline,
              Object.defineProperty(playerData, 'playtimeHHMMSS', {
                value: hhmmss(player.playtime)
              })
              playerData.banned = player.banned;
              playerData.server = player.server;
              playerData.name = player.name;
              toSend.players.push(playerData);
            });
            resolve(toSend);
          });
        } catch (error) {
          throw error;
        }
      });
    }

    async function loadPlayerProfilePicture(steamId) {
      let request = require('request-promise-native');
      return new Promise((resolve, reject) => {
        request({
          uri: 'http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002',
          qs: {
            steamids: steamId,
            key: process.env.API_KEY_STEAM,
          },
          json: true
        }).then(async (response) => {
          try {
            if (!_.isUndefined(response.response) || !_.isUndefined(response.response.players)) {
              let avatarUrl = response.response.players[0].avatarfull;
              let updatedPlayer = await Player.update({
                steamId: steamId
              }, {
                avatarUrl: avatarUrl
              });
              resolve(avatarUrl);
            } else {
              let avatarUrl = 'https://i.imgur.com/NMvWd07.png';
              let updatedPlayer = await Player.update({
                steamId: steamId
              }, {
                avatarUrl: avatarUrl
              });
              resolve(avatarUrl);
            }
          } catch (error) {
            sails.log.error(`HELPER - loadPlayerData:loadPlayerProfilePicture - ${error}`);
          }
        }).catch(async (error) => {
          let avatarUrl = 'https://i.imgur.com/NMvWd07.png';
          let updatedPlayer = await Player.update({
            steamId: steamId
          }, {
            avatarUrl: avatarUrl
          });
          resolve(avatarUrl);
        });
      });
    }


  },
};
