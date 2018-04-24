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
                let playerInventory = await loadPlayerInventory(playerProfile.steamId, server);
                let playerStats = await loadPlayerStats(playerProfile.steamId, server);
                let steamInfo = await loadPlayerSteamInfo(player.steamId)

                if (!_.isUndefined(playerInventory)) {
                    _.omit(playerInventory, 'playername');
                    playerProfile = await Player.update({ id: playerProfile.id }, {
                        inventory: playerInventory
                    }).fetch()
                }

                if (!_.isUndefined(playerStats)) {
                    _.omit(playerStats, 'steamId');
                    playerProfile = await Player.update({ id: playerProfile.id }, playerStats).fetch();
                }

                playersToSend.push(playerProfile[0]);
            }

            sails.log.debug(`HELPER - loadPlayerData - Loaded player data for server ${inputs.serverId}! SteamId: ${inputs.steamId} - Found ${playersToSend.length} players`);
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
            name: player.name,
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
        return undefined
        sails.log.error(`HELPER - loadPlayerData:loadPlayerStats - ${error}`);

    }
}

function loadPlayerSteamInfo(steamId) {
    console.log('TODO: LOAD STEAM INFO')
}




