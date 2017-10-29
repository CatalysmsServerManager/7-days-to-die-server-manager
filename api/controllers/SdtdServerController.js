/**
 * SdtdServerController
 *
 * @description :: Server-side logic for managing sdtdservers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    init: async function(req, res) {
        sails.log("Initializing a new 7 Days to die server")
        const serverID = req.query.id
        await sails.helpers.connectToTelnet({ id: serverID })
        res.send(`Initializing server with id ${serverID}`)

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