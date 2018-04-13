var sevenDays = require('machinepack-7daystodiewebapi');

module.exports = function historicalInfo(sails) {

    let historicalInfoMap = new Map();

    return {
        initialize: function (cb) {
            sails.on('hook:orm:loaded', async function () {
                sails.on('hook:sdtdlogs:loaded', async function() {
                    console.log('historical info loaded')
                    return cb()
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

};
