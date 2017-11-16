/**
 * SdtdServerController
 *
 * @description :: Server-side logic for managing sdtdservers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var sevenDays = require('machinepack-7daystodiewebapi');

module.exports = {
    addServer: async function(req, res) {
        const IP = req.param('IP');
        const telnetPort = parseInt(req.param('TelnetPort'));
        const telnetPassword = req.param('TelnetPassword');
        const webPort = parseInt(req.param('webPort')) || telnetPort + 1;

        await sails.helpers.connectToTelnet({
            ip: IP,
            port: telnetPort,
            password: telnetPassword
        }).switch({
            error: function(error) {
                return res.badRequest('Could not connect to telnet. Please verify the info is correct.' + error);
            },

            success: async function(telnetConnection) {
                await sails.helpers.createWebToken({
                    telnetConnection: telnetConnection
                }).switch({
                    error: function(error) {
                        return res.badRequest('Connected to telnet, but cannot add web authorization token.' + error);
                    },
                    success: async function(authInfo) {

                        await sevenDays.getServerInfo({
                            ip: IP,
                            port: webPort,
                            authName: authInfo.authName,
                            authToken: authInfo.authToken
                        }).exec({
                            error: function(error) {
                                return res.badRequest('Could not connect to the web API of your server.' + error);
                            },
                            success: async function(serverInfo) {

                                sails.models.sdtdserver.create({
                                    ip: IP,
                                    telnetPort: telnetPort,
                                    telnetPassword: telnetPassword,
                                    webPort: webPort,
                                    authName: authInfo.authName,
                                    authToken: authInfo.authToken,
                                    owner: req.session.userId,
                                    name: serverInfo.GameHost.value,
                                    description: serverInfo.ServerDescription.value,
                                    mapType: serverInfo.LevelName.value,
                                    version: serverInfo.Version.value,
                                    maxPlayers: serverInfo.MaxPlayers.value,
                                    gameDifficulty: serverInfo.GameDifficulty.value,
                                    dayNightLength: serverInfo.DayNightLength.value,
                                    zombiesRun: serverInfo.ZombiesRun.value,
                                    dropOnDeath: serverInfo.DropOnDeath.value,
                                    playerKillingMode: serverInfo.PlayerKillingMode.value,
                                    lootRespawnDays: serverInfo.LootRespawnDays.value,
                                    landClaimSize: serverInfo.LandClaimSize.value,
                                    isPasswordProtected: serverInfo.IsPasswordProtected.value,
                                    EACEnabled: serverInfo.EACEnabled.value,
                                    requiresMod: serverInfo.RequiresMod.value,
                                }).meta({ fetch: true }).exec(async function(err, createdServer) {
                                    if (err) { return res.serverError(err); }
                                    await sails.helpers.loadPlayerData({ serverID: createdServer.id }).switch({
                                        success: function() {
                                            if (typeof req.session.servers === Array) {
                                                req.session.servers.push(createdServer);
                                            } else {
                                                req.session.servers = new Array(createdServer);
                                            }
                                            return res.redirect(`/sdtdserver/dashboard/${createdServer.id}`);
                                        },
                                        noPlayers: function() {
                                            return res.redirect(`/sdtdserver/dashboard/${createdServer.id}`);
                                        },
                                        error: function(error) {
                                            return res.serverError(error);
                                        }
                                    });
                                });
                            }
                        });

                    }
                });
            },

        });
    },

    dashboard: async function(req, res) {
        const serverID = req.param('serverID');

        let day7data;
        let onlinePlayers;

        sails.helpers.getStats({
            id: serverID,
        }).switch({
            success: function(data) {
                day7data = data;
                sails.helpers.getPlayersOnline({
                    id: serverID
                }).switch({
                    success: function(data) {
                        onlinePlayers = data;

                        return res.view('dashboard.ejs', {
                            serverID: serverID,
                            day7data,
                            onlinePlayers
                        });
                    },
                    error: function(err) {
                        return res.badRequest('Invalid permissions for 7 days server. Please check your webtokens or add your server again.' + err);
                    }
                });
            },
            error: function(err) {
                return res.badRequest('Invalid permissions for 7 days server. Please check your webtokens or add your server again.' + err);
            }
        });



    },

    showPlayers: async function(req, res) {
        const serverID = req.param('serverID');

        let playerData = await Player.find({ server: serverID });
        return res.view('players', {
            players: playerData
        });
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

    console: function(req, res) {
        const serverID = req.param('serverID');
        sails.models.sdtdserver.findOne({ id: serverID }).exec(function(error, server) {
            if (error) {
                sails.log.error(error);
                throw error;
            }
            res.view('console', { server: server })
        });

    },

    subscribeToConsoleSocket: async function(req, res) {
        const serverID = req.param('serverID');
        if (_.isUndefined(serverID)) {
            return res.badRequest("No server ID found!");
        }

        if (!req.isSocket) {
            return res.badRequest('Req must have a socket');
        }

        sails.sockets.join(req, serverID);

        return res.json({
            message: 'Connected to console!'
        });
    },


};