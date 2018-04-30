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

    fn: async function (inputs, exits) {

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

            // if onlyOnline is true, we only load info about online players. We filter the array for that
            if (inputs.onlyOnline) {
                playerList.players = playerList.players.filter(player => {
                    return player.online
                })
                playerList.total = playerList.players.length;
                playerList.totalUnfiltered = playerList.players.length;
            }

            let playersToSend = new Array();

            for (const player of playerList.players) {
                let playerProfile = await findOrCreatePlayer(player, inputs.serverId);
                let steamAvatar = await loadSteamAvatar(player.steamid);
                
                // Inventory & stats data is only available when a player is online, so we only load it then.
                let playerInventory
                let playerStats
                if (player.online) {
                    playerInventory = await loadPlayerInventory(player.steamid, server);
                    playerStats = await loadPlayerStats(player.steamid, server);
                }

                // Update some basic info
                playerProfile = await Player.update({ id: playerProfile.id }, {
                    lastOnline: player.lastonline,
                    name: player.name ? player.name : "Unknown",
                    ip: player.ip,
                    entityId: player.entityid,
                    positionX: player.position.x,
                    positionY: player.position.y,
                    positionZ: player.position.z,
                    playtime: player.totalplaytime,
                    banned: player.banned
                }).fetch()
                if (!_.isUndefined(playerInventory)) {
                    playerInventory = _.omit(playerInventory, 'playername');
                    playerProfile = await Player.update({ id: playerProfile[0].id }, {
                        inventory: playerInventory
                    }).fetch()
                }

                if (!_.isUndefined(playerStats)) {
                    playerStats = _.omit(playerStats, 'steamId');
                    playerProfile = await Player.update({ id: playerProfile[0].id }, playerStats).fetch();

                }


                if (!_.isUndefined(steamAvatar)) {
                    playerProfile = await Player.update({id: playerProfile[0].id}, {avatarUrl: steamAvatar}).fetch()

                }

                if (player.online) {
                    playerProfile[0].online = true
                }
                sails.log.verbose(`Loaded a player - ${playerProfile[0].id}`)
                playersToSend.push(playerProfile[0]);
            }

            sails.log.debug(`HELPER - loadPlayerData - Loaded player data for server ${inputs.serverId}! SteamId: ${inputs.steamId}`, playersToSend.map(player => {
                return player.name
            }));
            return exits.success(playersToSend)


        } catch (error) {
            exits.error(error);
        }


    },
};

async function getPlayerList(server) {
    return new Promise((resolve, reject) => {
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
    });
}


async function findOrCreatePlayer(player, serverId) {
    try {
        let foundOrCreatedPlayer = await Player.findOrCreate({ server: serverId, steamId: player.steamid }, {
            steamId: player.steamid,
            server: serverId,
            entityId: player.entityid,
            lastOnline: player.lastonline,
            name: player.name ? player.name : "Unknown",
            ip: player.ip,
        });
        return foundOrCreatedPlayer;
    } catch (error) {
        sails.log.error(`HELPER - loadPlayerData:findOrCreatePlayer ${error}`);
        return undefined;
    }
}

function loadPlayerInventory(steamId, server) {
    return new Promise((resolve, reject) => {
        sevenDays.getPlayerInventory({
            ip: server.ip,
            port: server.webPort,
            authName: server.authName,
            authToken: server.authToken,
            steamId: steamId
        }).exec({
            error: function (err) {
                sails.log.error(`HELPER - loadPlayerData:loadPlayerInventory ${err}`);
                resolve(undefined);
            },
            success: function (data) {
                resolve(data)
            }
        });
    })
}

async function loadPlayerStats(steamId, server) {
    try {
        let playerStats = await sails.helpers.sdtd.loadPlayerStats(server.id, steamId);
        return playerStats
    } catch (error) {
        sails.log.error(`HELPER - loadPlayerData:loadPlayerStats - ${error}`);
        return undefined

    }
}

function loadSteamAvatar(steamId) {
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
            let avatar = undefined
            if (response.response.players[0].avatar) {
                avatar = response.response.players[0].avatar
            } 
            if (response.response.players[0].avatarfull) {
                avatar = response.response.players[0].avatarfull
            } 
            resolve(avatar)
        }).catch(async (error) => {
            sails.log.error(`HELPER - loadPlayerData:loadSteamAvatar ${error}`);
            resolve()
        });
    });
}




