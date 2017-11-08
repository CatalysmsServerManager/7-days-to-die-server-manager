/**
 * SdtdServerController
 *
 * @description :: Server-side logic for managing sdtdservers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var sevenDays = require('machinepack-7daystodiewebapi');

module.exports = {
    addServer: async function(req, res) {
        const IP = req.param("IP")
        const telnetPort = parseInt(req.param("TelnetPort"))
        const telnetPassword = req.param("TelnetPassword")
        const webPort = telnetPort + 1

        await sails.helpers.connectToTelnet({
            ip: IP,
            port: telnetPort,
            password: telnetPassword
        }).switch({
            error: function(error) {
                return res.badRequest("Could not connect to telnet. Please verify the info is correct." + error)
            },

            success: async function(telnetConnection) {
                await sails.helpers.createWebToken({
                    telnetConnection: telnetConnection
                }).switch({
                    error: function(error) {
                        return res.badRequest("Connected to telnet, but cannot add web authorization token." + error)
                    },
                    success: async function(authInfo) {

                        await sevenDays.getServerInfo({
                            ip: IP,
                            port: webPort,
                            authName: authInfo.authName,
                            authToken: authInfo.authToken
                        }).exec({
                            error: function(error) {
                                return res.badRequest("Could not connect to the web API of your server." + error)
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
                                    if (err) return res.serverError(err);
                                    await sails.helpers.loadPlayerData({ serverID: createdServer.id }).switch({
                                        success: function(playerData) {
                                            return res.redirect(`/sdtdserver/dashboard/${createdServer.id}`)
                                        },
                                        noPlayers: function() {
                                            return res.redirect(`/sdtdserver/dashboard/${createdServer.id}`)
                                        },
                                        error: function(error) {
                                            return res.serverError(error)
                                        }
                                    })
                                })
                            }
                        })

                    }
                })
            },

        })






    },

    dashboard: async function(req, res) {

        const serverID = req.param("serverID")

        let day7data
        let onlinePlayers

        await sails.helpers.getStats({
            id: serverID,
        }).switch({
            success: function(data) {
                day7data = data;
            },
            error: function(err) {
                return res.badRequest("Invalid permissions for 7 days server. Please check your webtokens or add your server again.")
            }
        })

        await sails.helpers.getPlayersOnline({
            id: serverID
        }).switch({
            success: function(data) {
                onlinePlayers = data
                res.view('dashboard.ejs', {
                    title: "Server Dashboard",
                    day7data,
                    onlinePlayers
                })
            },
            error: function(err) {
                return res.badRequest("Invalid permissions for 7 days server. Please check your webtokens or add your server again.")
            }
        })


    },


};