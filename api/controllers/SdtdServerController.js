/**
 * SdtdServerController
 *
 * @description :: Server-side logic for managing sdtdservers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var sevenDays = require('machinepack-7daystodiewebapi');

module.exports = {

    dashboard: async function(req, res) {
        const serverID = req.param('serverID');
        sails.models.sdtdserver.findOne({ id: serverID }).exec(function(error, server) {
            if (error) {
                sails.log.error(error);
                throw error;
            }
            res.view('dashboard/dashboard', { server: server })
        });
    },

    console: function(req, res) {
        const serverID = req.param('serverID');
        if (_.isUndefined(serverID)) {
            return res.badRequest("No serverID given");
        }


        sails.models.sdtdserver.findOne({ id: serverID }).exec(function(error, server) {
            if (error) {
                return res.badRequest("Unknown server");
            } else {
                return res.view('console/console', { server: server });
            }
        });
    },

    showPlayers: function(req, res) {

        const serverID = req.param('serverID');
        if (_.isUndefined(serverID)) {
            return res.badRequest("No server ID given");
        } else {
            sails.models.player.find({ server: serverID }).exec(function(error, players) {
                if (error) {
                    sails.log.error(error);
                    return res.serverError(error)
                }
                res.view('player/players', {
                    serverID: serverID,
                    players: players
                })
            })
        }

    },

    showOnlinePlayers: async function(req, res) {
        const serverID = req.param('serverID');


        if (_.isUndefined(serverID)) {
            return res.badRequest("No server ID given");
        } else {
            sails.models.sdtdserver.findOne({ id: serverID }).exec(function(error, server) {
                if (error) {
                    sails.log.error(error);
                    throw error;
                }
                sevenDays.getOnlinePlayers({
                    ip: server.ip,
                    port: server.webPort,
                    authName: server.authName,
                    authToken: server.authToken,
                }).exec({
                    error: function(error) {
                        return res.serverError(error);
                    },
                    connectionRefused: function(error) {
                        return res.badRequest(error);
                    },
                    unauthorized: function(error) {
                        return res.badRequest(error);
                    },
                    success: function(data) {
                        return res.view('dashboard/onlinePlayers', {
                            server: server,
                            data: data
                        });
                    }
                })
            });
        };
    },

    onlinePlayers: function(req, res) {
        const serverID = req.query.serverid;

        if (_.isUndefined(serverID)) {
            return res.badRequest("No server ID given");
        } else {
            sails.models.sdtdserver.findOne({ id: serverID }).exec(function(error, server) {
                if (error) {
                    sails.log.error(error);
                    throw error;
                }
                sevenDays.getOnlinePlayers({
                    ip: server.ip,
                    port: server.webPort,
                    authName: server.authName,
                    authToken: server.authToken,
                }).exec({
                    error: function(error) {
                        return res.serverError(error);
                    },
                    connectionRefused: function(error) {
                        return res.badRequest(error);
                    },
                    unauthorized: function(error) {
                        return res.badRequest(error);
                    },
                    success: function(data) {
                        return res.status(200).json(data)
                    }
                });
            });
        }
    },

    startLogging: async function(req, res) {
        const serverID = req.param('serverID');
        sails.log.info(`Starting logging for ${serverID}`);
        try {
            sails.hooks.sdtdlogs.start(serverID);
        } catch (error) {
            res.serverError(error);
        }
    },

    stopLogging: async function(req, res) {
        const serverID = req.param('serverID');
        sails.log.info(`Stopping logging for ${serverID}`);
        try {
            sails.hooks.sdtdlogs.stop(serverID);
        } catch (error) {
            res.serverError(error);
        }
    },

    subscribeToServerSocket: function(req, res) {
        const serverID = req.param('serverID');
        if (_.isUndefined(serverID)) {
            return badRequest("No server ID given.");
        }
        if (!req.isSocket) {
            return res.badRequest();
        }

        sails.models.sdtdserver.findOne({ id: serverID }).exec(function(error, server) {
            if (error) {
                return res.badRequest("Unknown server");
            } else {
                sails.sockets.join(req, serverID);
                return res.ok()
            }

        });


    }

};