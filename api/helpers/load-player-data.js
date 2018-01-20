var sevenDays = require('machinepack-7daystodiewebapi');

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
    sails.log.debug(`HELPER - loadPlayerData - Loading player data for server ${inputs.serverId} -- steamId: ${inputs.steamId}`);

    try {
      let server = await SdtdServer.findOne(inputs.serverId);
      let playerList = await getPlayerList(server);
      if (playerList.players) {
        playerList = await loadPlayersInventory(playerList.players, server);
        let newPlayerList = await playerList.map(await updatePlayerInfo);
        let jsonToSend = await createJSON(newPlayerList);
      }

      let jsonToSend = await createJSON(playerList);
      exits.success(jsonToSend);
    } catch (error) {
      sails.log.error(`HELPER - loadPlayerData - ${error}`);
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
                reject(err)
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
              newPlayer.name = 'Unknown name'
            }
            foundOrCreatedPlayer = await Player.findOrCreate({
              steamId: newPlayer.steamid,
              server: inputs.serverId,
              entityId: newPlayer.entityid
            }, {
              steamId: newPlayer.steamid,
              server: inputs.serverId,
              entityId: newPlayer.entityid,
              name: newPlayer.name,
              ip: newPlayer.ip
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
                inventory: newPlayer.inventory,
                banned: newPlayer.banned
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
                playtime: newPlayer.totalplaytime,
                banned: newPlayer.banned
              }).fetch();
            }

            playerToSend = playerToSend[0];
            playerToSend.online = newPlayer.online;

            resolve(playerToSend);
          });
        } catch (error) {
          reject(error)
        }

      });
    }

    async function getPlayerList(server) {
      return new Promise((resolve, reject) => {
        sevenDays.getPlayerList({
          ip: server.ip,
          port: server.webPort,
          authName: server.authName,
          authToken: server.authToken
        }).exec({
          error: function (err) {
            reject(err)
          },
          success: function (playerList) {
            // If a steam ID is provided, we filter the list to only 1 player
            if (inputs.steamId) {
              let playerToFind;
              playerList.players.forEach(player => {
                if (player.steamid === inputs.steamId) {
                  playerToFind = player;
                }
              });
              if (_.isUndefined(playerToFind)) {
                return exits.playerNotFound();
              }
              playerList.players = new Array(playerToFind);
            }
            resolve(playerList);
          }
        });
      });
    }


    async function createJSON(playerList) {
      return new Promise(async function (resolve) {
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
  },
};
