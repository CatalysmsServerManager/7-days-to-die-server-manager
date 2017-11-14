var sevenDays = require('machinepack-7daystodiewebapi');

module.exports = function sdtdLogs(sails) {

    var loggingInfoMap = new Map();

    return {
        initialize: function(cb) {
            sails.on('hook:orm:loaded', function() {
                sails.models.sdtdserver.find({ loggingEnabled: true }).exec(function(err, enabledServers) {
                    if (err) {
                        sails.log.error(new Error("Error getting logging enabled servers from DB"));
                        throw err;
                    }

                    _.each(enabledServers, function(server) {
                        createLogObject(server.id);
                    });
                });
                // Create collection/map [serverID, logEmitter]
                return cb();
            });
        },

        start: function(serverID) {
            return sails.models.sdtdserver.update({ id: serverID }, { loggingEnabled: true })
                .exec(createLogObject(serverID))

        },

        stop: function(serverID) {
            if (loggingInfoMap.has(serverID)) {
                return sails.models.sdtdserver.update({ id: serverID }, { loggingEnabled: false })
                    .exec(function() {
                        let loggingObj = loggingInfoMap.get(serverID);
                        loggingObj.stop();
                    });
            }
        }
    };

    function createLogObject(serverID) {
        sails.models.sdtdserver.findOne({ id: serverID }).exec(function(error, server) {
            if (error) {
                sails.log.error(new Error(`Error creating a logging object for ${server.id}`));
                throw error;
            }

            sevenDays.startLoggingEvents({
                ip: server.ip,
                port: server.webPort,
                authName: server.authName,
                authToken: server.authToken,
            }).exec({
                error: function(error) {
                    sails.log.error(new Error(`Error starting logs for ${server.id}`));
                    throw error;
                },
                success: function(eventEmitter) {
                    loggingInfoMap.set(server.id, eventEmitter);
                }
            });
        });

    }
}