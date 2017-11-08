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
                    success: function(authInfo) {
                        sails.models.sdtdserver.create({
                            ip: IP,
                            telnetPort: telnetPort,
                            telnetPassword: telnetPassword,
                            webPort: telnetPort + 1,
                            authName: authInfo.authName,
                            authToken: authInfo.authToken,
                            owner: req.session.userId
                        }).meta({ fetch: true }).exec(async function(err, createdServer) {
                            if (err) return res.serverError(err);
                            await sails.helpers.loadPlayerData({ serverID: createdServer.id }).switch({
                                success: function(playerData) {
                                    return res.redirect(`/sdtdserver/dashboard?id=${createdServer.id}`)
                                },
                                noPlayers: function() {
                                    return res.view("welcome")
                                },
                                error: function(error) {
                                    return res.serverError(error)
                                }
                            })
                        })
                    }
                })
            },

        })






    },

    dashboard: async function(req, res) {

        const serverID = req.query.id

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