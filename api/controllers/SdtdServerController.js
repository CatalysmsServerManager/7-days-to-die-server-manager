/**
 * SdtdServerController
 *
 * @description :: Server-side logic for managing sdtdservers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    addServer: async function(req, res) {
        const IP = req.query.IP
        const telnetPort = parseInt(req.query.TelnetPort)
        const telnetPassword = req.query.TelnetPassword
        if (!IP || !telnetPort || !telnetPassword) {
            return res.view('addServer', {
                ipError: "",
                portError: "",
                passwordError: ""
            })
        }

        try {
            let connection = await sails.helpers.connectToTelnet({
                ip: IP,
                port: telnetPort,
                password: telnetPassword
            })
            const authInfo = await sails.helpers.createWebToken({
                telnetConnection: connection
            })
            sails.models.sdtdserver.create({
                    ip: IP,
                    telnetPort: telnetPort,
                    telnetPassword: telnetPassword,
                    webPort: telnetPort + 1,
                    authName: authInfo.authName,
                    authToken: authInfo.authToken
                }).meta({ fetch: true })
                .exec(function(err, sdtdServer) {
                    if (err) {
                        return res.view('addServer', {
                            ipError: err,
                            portError: "",
                            passwordError: ""
                        })
                    }
                    return res.redirect(`/sdtdserver/dashboard?id=${sdtdServer.id}`)
                })



        } catch (error) {
            res.view('addServer', {
                ipError: error,
                portError: "",
                passwordError: ""
            })
        }




    },

    dashboard: async function(req, res) {
        sails.log("Showing dashboard for a server")
        const serverID = req.query.id
        const day7data = await sails.helpers.getStats({
            id: serverID
        })
        res.view('dashboard.ejs', {
            title: "Server Dashboard",
            day7data
        })
    }
};