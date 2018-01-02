var sevenDays = require('machinepack-7daystodiewebapi');

/**
 * SdtdServerController
 * @module SdtdServerController
 * @description :: Server-side logic for managing 7 Days to Die servers
 */

module.exports = {

    /**
     * @description Add a server to the system
     * @param {string} serverip Ip of the server to add
     * @param {number} telnetport Telnet port of the server
     * @param {string} telnetpassword Telnet password of the server
     * @param {number} webport Port for webserver added by Alloc's fixes
     */
    addServer: async function(req, res) {
        if (_.isUndefined(req.param('serverip'))) {
            return res.badRequest('A server IP is required but was not given');
        }
        if (_.isUndefined(req.param('telnetport'))) {
            return res.badRequest('A telnet port is required but was not given');
        }
        if (_.isUndefined(req.param('telnetpassword'))) {
            return res.badRequest('A telnet password is required but was not given');
        }
        if (_.isUndefined(req.param('webport'))) {
            return res.badRequest('A web port is required but was not given');
        }

        const serverip = req.param('serverip');
        const telnetport = req.param('telnetport');
        const telnetpassword = req.param('telnetpassword');
        const webport = req.param('webport');

        SdtdServer.find({
            ip: serverip,
            telnetPort: telnetport,
            webPort: webport,
        }).exec(function(err, foundServers) {
            if (err) {
                return res.serverError(new Error("Error checking for existing server"));
            }
            if (!_.isUndefined(foundServers) && foundServers.length > 0) {
                sails.log.warn(`User tried to add a server that is already in the system`);
                return res.badRequest(`This server has already been added to the system`);
            }

            sails.helpers.createWebToken({
                ip: serverip,
                port: telnetport,
                password: telnetpassword
            }).switch({
                success: async function(authInfo) {
                    sails.log.debug('Successfully connected to telnet & created tokens');
                    var createdServer = await SdtdServer.create({
                        ip: serverip,
                        telnetPort: telnetport,
                        telnetPassword: telnetpassword,
                        webPort: webport,
                        authName: authInfo.authName,
                        authToken: authInfo.authToken,
                        owner: req.signedCookies.userProfile.id
                    }).fetch();
                    await sails.hooks.sdtdlogs.start(createdServer.id);
                    return res.json(createdServer);

                },
                error: function(error) {
                    sails.log.warn('Could not connect to servers telnet ' + error);
                    res.badRequest('Could not connect to the servers telnet');
                }
            });
        });



    },

    /**
     * @description Starts detecting events for a server
     * @param {number} serverID ID of the server
     */

    startLogging: async function(req, res) {
        const serverID = req.param('serverID');
        sails.log.info(`Starting logging for ${serverID}`);
        try {
            sails.hooks.sdtdlogs.start(serverID);
        } catch (error) {
            res.serverError(error);
        }
    },

    /**
     * @description Stops detecting events for a server
     * @param {number} serverID ID of the server
     */

    stopLogging: async function(req, res) {
        const serverID = req.param('serverID');
        sails.log.info(`Stopping logging for ${serverID}`);
        try {
            sails.hooks.sdtdlogs.stop(serverID);
        } catch (error) {
            res.serverError(error);
        }
    },

    /**
     * @description Subscribe to a socket to receive event notifications
     * @param {number} serverID ID of the server
     */
    subscribeToServerSocket: function(req, res) {
        const serverID = req.param('serverID');
        sails.log.debug(`Connecting user with id ${req.session.userId} to server socket with id ${serverID}`)
        if (_.isUndefined(serverID)) {
            return res.badRequest("No server ID given.");
        }
        if (!req.isSocket) {
            return res.badRequest();
        }
        sails.models.sdtdserver.findOne({ id: serverID }).exec(function(error, server) {
            if (error) {
                return res.badRequest("Unknown server");
            } else {
                sails.log.debug(`Successfully connected`);
                sails.sockets.join(req, serverID);
                return res.ok();
            }

        });
    },

    /**
     * @description Load/update server info and save to DB
     * @param {number} serverID ID of the server
     */

    loadServerInfo: function(req, res) {
        const serverId = req.param('serverID');
        sails.log.debug(`Updating server info for ${serverId}`);
        if (_.isUndefined(serverId)) {
            return res.badRequest("No server ID given.");
        }
        sails.helpers.loadServerInfo({
            serverId: serverId
        }).exec({
            success: function() {
                return res.ok();
            },
            connectionError: function(error) {
                return res.badRequest(new Error('Could not connect to server'));
            },
            databaseError: function(error) {
                return res.serverError(new Error('Database error'));
            }
        });
    },

    // _____  ______  _____ _______            _____ _____ 
    // |  __ \|  ____|/ ____|__   __|     /\   |  __ \_   _|
    // | |__) | |__  | (___    | |       /  \  | |__) || |  
    // |  _  /|  __|  \___ \   | |      / /\ \ |  ___/ | |  
    // | | \ \| |____ ____) |  | |     / ____ \| |    _| |_ 
    // |_|  \_\______|_____/   |_|    /_/    \_\_|   |_____|

    /**
     * @description GET online players
     * @param {number} serverID ID of the server 
     */

    onlinePlayers: function(req, res) {
        const serverID = req.query.serverId;

        sails.log.debug(`Showing online players for ${serverID}`);

        if (_.isUndefined(serverID)) {
            return res.badRequest("No server ID given");
        } else {
            sails.models.sdtdserver.findOne({ id: serverID }).exec(function(error, server) {
                if (error) {
                    sails.log.error(error);
                    res.serverError(error);
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

    /**
     * @description Get information about all players that have logged into the server
     * @param {number} serverID ID of the server 
     */

    getPlayers: function(req, res) {
        const serverId = req.query.serverId;
        if (_.isUndefined(serverId)) {
            return res.badRequest("No server ID given.");
        }
        sails.log.debug(`Showing all players for ${serverId}`);

        SdtdServer.findOne({ id: serverId }).exec(function(err, server) {
            if (err) { return res.serverError(new Error(`Database error`)); }
            sevenDays.getPlayerList({
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
                    return res.status(200).json(data.players)
                }
            });
        });

    },

    /**
     * @description Get basic information and game settings of a 7dtd server
     * @param {number} serverID ID of the server 
     */

    getServerInfo: function(req, res) {
        const serverId = req.query.serverId;
        if (_.isUndefined(serverId)) {
            return res.badRequest("No server ID given.");
        }
        sails.log.debug(`Showing server info for ${serverId}`);
        SdtdServer.findOne({ id: serverId }).exec(function(err, foundServer) {
            if (err) { return res.serverError(new Error(`Database error`)); }
            return res.json(foundServer);
        });

    },

    /**
     * @description Executes a command on a 7dtd server
     * @param {number} serverID ID of the server 
     * @param {string} command Command to be executed
     */

    executeCommand: function(req, res) {
        const serverID = req.param('serverID');
        const command = req.param('command');
        if (_.isUndefined(serverID)) {
            return res.badRequest("No serverID given");
        }
        if (_.isUndefined(command)) {
            return res.badRequest("No command given");
        }
        sails.models.sdtdserver.findOne({ id: serverID }).exec(function(error, server) {
            if (error) {
                return res.badRequest("Unknown server");
            } else {
                sails.log.debug(`User ${req.session.userId} executed a command on server ${server.id} ${command}`);
                sevenDays.executeCommand({
                    ip: server.ip,
                    port: server.webPort,
                    authName: server.authName,
                    authToken: server.authToken,
                    command: command
                }).exec({
                    error: function(error) {
                        return res.badRequest(new Error('Error executing command\n' + error));
                    },
                    success: function(response) {
                        let logLine = {
                            msg: response.result,
                            date: new Date(),
                            type: 'commandResponse'
                        };
                        sails.sockets.broadcast(server.id, 'logLine', logLine);
                        return res.json(logLine);
                    }
                });
            }
        });

    },

};