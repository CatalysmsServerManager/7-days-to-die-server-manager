var sevenDays = require('machinepack-7daystodiewebapi');

module.exports = function historicalInfo(sails) {

    let historicalInfoMap = new Map();

    return {
        /**
         * @name initialize
         * @memberof module:7dtdLoggingHook
         * @description Called on app launch, loads all servers which have logging enabled and creates logging objects for these
         * @method
         * @private
         */
        initialize: function (cb) {
            sails.on('hook:orm:loaded', async function () {
                sails.on('hook:sdtdlogs:loaded', async function() {
                    
                })

            });
        },

        start: async function (serverID) {
        },

        stop: async function (serverID) {

        },


        getStatus: function (serverId) {
            serverId = String(serverId);
            let status = historicalInfoMap.has(serverId);
            return status;
        }
    };

};
