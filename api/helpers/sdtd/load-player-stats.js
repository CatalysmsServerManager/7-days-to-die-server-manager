var sevenDays = require('machinepack-7daystodiewebapi');

module.exports = {


    friendlyName: 'Load player stats',


    description: 'Loads zombie/players kills, level and score & saves to DB',


    inputs: {

        serverId: {
            type: 'number',
            required: true
        }

    },
    description: 'Id of the server',


    exits: {
        success: {
            outputFriendlyName: 'Success',
        }
    },

    fn: async function (inputs, exits) {
        sails.log(`LOADING PLAYER STATS`)
        let server = await SdtdServer.findOne({ id: inputs.serverId });

        sevenDays.executeCommand({
            ip: server.ip,
            port: server.webPort,
            authName: server.authName,
            authToken: server.authToken,
            command: "listplayers"
        }).exec({
            error: error => {
                console.log(error)
                exits.error(error)
            },
            success: data => {
                let playerSplitResult = data.result.split('\n');
                playerSplitResult.forEach(async playerInfo => {
                    let splitResult = playerInfo.split(', ');
                    let deaths, zombieKills, playerKills, score, level, steamId;

                    splitResult.forEach(dataPoint => {
                        if (dataPoint.startsWith('deaths=')) {
                            dataPoint = dataPoint.replace('deaths=', '');
                            parseInt(dataPoint, 10);
                            deaths = dataPoint;
                        }

                        if (dataPoint.startsWith('steamid=')) {
                            dataPoint = dataPoint.replace('steamid=', '');
                            parseInt(dataPoint, 10);
                            steamId = dataPoint;
                        }

                        if (dataPoint.startsWith('zombies=')) {
                            dataPoint = dataPoint.replace('zombies=', '');
                            parseInt(dataPoint, 10);
                            zombieKills = dataPoint;
                        }

                        if (dataPoint.startsWith('players=')) {
                            dataPoint = dataPoint.replace('players=', '');
                            parseInt(dataPoint, 10);
                            playerKills = dataPoint;
                        }

                        if (dataPoint.startsWith('score=')) {
                            dataPoint = dataPoint.replace('score=', '');
                            parseInt(dataPoint, 10);
                            score = dataPoint;
                        }
                        if (dataPoint.startsWith('level=')) {
                            dataPoint = dataPoint.replace('level=', '');
                            parseInt(dataPoint, 10);
                            level = dataPoint;
                        }

                    })
                    let updatedPlayers = await Player.update({
                        server: inputs.serverId,
                        steamId: steamId
                    }, {
                            deaths: deaths,
                            zombieKills: zombieKills,
                            playerKills: playerKills,
                            score: score,
                            level: level
                        }).fetch();
                })

                exits.success(data);
            }
        })

    }


};
