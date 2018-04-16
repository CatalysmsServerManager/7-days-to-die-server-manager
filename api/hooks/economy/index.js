var sevenDays = require('machinepack-7daystodiewebapi');
const PlaytimeEarner = require('./objects/playtimeEarner');

let playtimeEarnerMap = new Map();


module.exports = function economy(sails) {


    return {
        initialize: function (cb) {

            sails.on('hook:discordbot:loaded', async function () {
                
                let economyEnabledServers = await SdtdConfig.find({
                    economyEnabled: true
                });
                sails.log.info(`HOOK: economy - Initializing ${economyEnabledServers.length} servers`);
                for (let config of economyEnabledServers) {
                    await startPlaytimeEarner(config.server)
                }

                return cb();
            });


        },

        start: async function (serverId, type) {

            switch (type) {
                case 'playtimeEarner':
                    return startPlaytimeEarner(serverId);
                    break;

                default:
                    throw new Error('Unknown updateObject type')
                    break;
            }
        },

        stop: async function (serverId, type) {
            switch (type) {
                case 'playtimeEarner':
                    return stopPlaytimeEarner(serverId);
                    break;

                default:
                    throw new Error('Unknown updateObject type')
                    break;
            }
        },

        getStatus: function (server, type) {
            switch (type) {
                case 'playtimeEarner':
                    return playtimeEarnerMap.has(String(server.id ? server.id : server))
                    break;

                default:
                    throw new Error('Unknown updateObject type')
                    break;
            }
        }

    };
}


async function startPlaytimeEarner(serverId) {
    try {
        await SdtdConfig.update({server: serverId}, {playtimeEarnerEnabled: true});

        if (getMap(serverId, 'playtimeEarner')) {
            console.log(`ALREADY ENABLED`)
            return
        }

        const server = await SdtdServer.findOne(serverId).populate('config');
        const config = server.config[0];
        let loggingObject = await sails.hooks.sdtdlogs.getLoggingObject(server.id);
        let playtimeEarnerObject = new PlaytimeEarner(server, config, loggingObject);
        await playtimeEarnerObject.start();
        setMap(server, playtimeEarnerObject);
        return true
    } catch (error) {
        sails.log.error(`HOOK - economy - Error starting playtimeEarner ${error}`)
        return false
    }
}


async function stopPlaytimeEarner(serverId) {
    try {
        await SdtdConfig.update({server: serverId}, {playtimeEarnerEnabled: false});

        if (!getMap(serverId, 'playtimeEarner')) {
            console.log(`ALREADY DISABLED`)
            return
        }

        let playtimeEarnerObject = await getMap(serverId);
        playtimeEarnerObject.stop();
        deleteMap(serverId, playtimeEarnerObject);
    } catch (error) {
        sails.log.error(`HOOK - economy - Error stopping playtimeEarner ${error}`)
    }
}


function getMap(server, type) {
    console.log(type)
    switch (type) {
        case 'playtimeEarner':
            return playtimeEarnerMap.get(String(server.id ? server.id : server))
            break;

        default:
            throw new Error('Unknown updateObject type')
            break;
    }
}

function setMap(server, updateObject) {
    switch (updateObject.type) {
        case 'playtimeEarner':
            return playtimeEarnerMap.set(String(server.id ? server.id : server), updateObject);
            break;

        default:
            throw new Error('Must set a known type in updateObject')
            break;
    }
}

function deleteMap(server, updateObject) {
    switch (updateObject.type) {
        case 'playtimeEarner':
            return playtimeEarnerMap.delete(String(server.id ? server.id : server), updateObject);
            break;

        default:
            throw new Error('Must set a known type in updateObject')
            break;
    }
}