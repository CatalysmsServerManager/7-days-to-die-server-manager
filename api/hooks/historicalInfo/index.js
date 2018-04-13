var sevenDays = require('machinepack-7daystodiewebapi');
let MemUpdate = require('./objects/memUpdate');

module.exports = function historicalInfo(sails) {

    let memUpdateMap = new Map();

    return {
        initialize: function (cb) {
            sails.on('hook:orm:loaded', async function () {
                sails.on('hook:sdtdlogs:loaded', async function () {

                    let memUpdateEnabledServers = await SdtdConfig.find({
                        memUpdateInfoEnabled: true
                    }).populate('server');
                    for (let config of memUpdateEnabledServers) {
                        let server = config.server;
                        let loggingObject = sails.hooks.sdtdlogs.getLoggingObject(server.id);
                        let memUpdateObject = new MemUpdate(server, config, loggingObject);
                        await memUpdateObject.start();
                        setMap(server, memUpdateObject)
                    }
                    return cb();
                })

            });
        },

        start: async function (serverId) {
        },

        stop: async function (serverId) {

        },


        getStatus: function (serverId) {
            serverId = String(serverId);
            let status = historicalInfoMap.get(serverId);
            return status;
        }
    };

    function getMap(server, type) {
        switch (type) {
            case 'memUpdate':
                memUpdateMap.get(String(server.id), updateObject)
                break;

            default:
                throw new Error('Unknown updateObject type')
                break;
        }
    }

    function setMap(server, updateObject) {
        switch (updateObject.type) {
            case 'memUpdate':
                memUpdateMap.set(String(server.id), updateObject);
                break;

            default:
                throw new Error('Must set a known type in updateObject')
                break;
        }
    }

    function deleteMap(serverId, updateObject) {
        switch (updateObject.type) {
            case 'memUpdate':
                memUpdateMap.delete(String(server.id), updateObject);
                break;

            default:
                throw new Error('Must set a known type in updateObject')
                break;
        }
    }

};
