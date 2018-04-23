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

            for (const player of playerList.players) {

                let player = await findOrCreatePlayer(player.steamid);
                let playerInventory = await loadPlayerInventory(steamId, server);
                let playerStats = await loadPlayerStats(steamId, server);

                console.log('TODO: update DB record(s)')
            }


        } catch (error) {
            exits.error(error);
        }


    },
};


async function findOrCreatePlayer(steamId, serverId) {
    try {
        let player = await Player.findOrCreate({ server: serverId, steamId: steamId });
        return player;
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
            steamId: steamid
        }).exec({
            error: function (err) {
                resolve(undefined);
            },
            success: function (data) {
                console.log('Loaded player inventory')
                console.log(data)
                resolve(data)
            }
        });
    })
}

async function loadPlayerStats(steamId, server) {
    let playerStats = await sails.helpers.sdtd.loadPlayerStats(inputs.serverId);
    console.log('Loaded player stats')
    console.log(playerStats)
    return playerStats
}

function loadPlayerSteamInfo(steamId) {
    console.log('TODO: LOAD STEAM INFO')
}




