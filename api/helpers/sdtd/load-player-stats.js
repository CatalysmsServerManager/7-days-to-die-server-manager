var sevenDays = require('machinepack-7daystodiewebapi');
const validator = require('validator');

module.exports = {


    friendlyName: 'Load player stats',


    description: 'Loads zombie/players kills, level and score & saves to DB',


    inputs: {

        serverId: {
            type: 'number',
            required: true
        },
        steamId: {
            type: 'string',
            minLength: 1
        }

    },
    description: 'Id of the server',


    exits: {
        success: {
            outputFriendlyName: 'Success',
        }
    },

    fn: async function (inputs, exits) {
        let server = await SdtdServer.findOne({ id: inputs.serverId });
        let response = new Array();

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

                if (!data) {
                    return exits.error();
                }

                let playerSplitResult = data.result.split('\n');
                playerSplitResult = _.drop(playerSplitResult, 2);
                playerSplitResult.forEach(async playerInfo => {

                    let splitResult = playerInfo.split(', ');
                    let deaths, zombieKills, playerKills, score, level, steamId;
                    let playerStats = {
                        deaths: 0,
                        zombieKills: 0,
                        playerKills: 0,
                        score: 0,
                        level: 0,
                        steamId: undefined
                    }

                    splitResult.forEach(dataPoint => {
                        if (dataPoint.startsWith('deaths=')) {
                            dataPoint = dataPoint.replace('deaths=', '');
                            parseInt(dataPoint, 10);
                            playerStats.deaths = dataPoint;
                        }

                        if (dataPoint.startsWith('steamid=')) {
                            dataPoint = dataPoint.replace('steamid=', '');
                            parseInt(dataPoint, 10);
                            playerStats.steamId = dataPoint;
                        }

                        if (dataPoint.startsWith('zombies=')) {
                            dataPoint = dataPoint.replace('zombies=', '');
                            parseInt(dataPoint, 10);
                            playerStats.zombieKills = dataPoint;
                        }

                        if (dataPoint.startsWith('players=')) {
                            dataPoint = dataPoint.replace('players=', '');
                            parseInt(dataPoint, 10);
                            playerStats.playerKills = dataPoint;
                        }

                        if (dataPoint.startsWith('score=')) {
                            dataPoint = dataPoint.replace('score=', '');
                            parseInt(dataPoint, 10);
                            playerStats.score = dataPoint;
                        }
                        if (dataPoint.startsWith('level=')) {
                            dataPoint = dataPoint.replace('level=', '');
                            parseInt(dataPoint, 10);
                            playerStats.level = dataPoint;
                        }

                    })
                    response.push(playerStats);

                })

                if (inputs.steamId) {
                    response = response.filter(playerStats => {
                        return playerStats.steamId === inputs.steamId
                    })[0]
                }

                exits.success(response);
            }
        })

    }


};
