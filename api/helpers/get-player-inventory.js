module.exports = {


    friendlyName: 'Get player inventory',

    description: '',


    inputs: {
        serverID: {
            type: "number",
            description: "ID of the server to get stats from",
            required: true
        },
        playerID: {
            type: "number",
            description: "steam ID of the player to get stats from",
            required: true
        }
    },


    exits: {

        success: {
            outputFriendlyName: 'Player inventory',
        }

    },


    fn: async function(inputs, exits) {

        // Get player inventory.
        var playerInventory = await sails.helpers.webRequestToSdtdServer({
            id: inputs.serverID,
            apiModule: "getstats",
            extraqs: {
                steamid: inputs.playerID
            }
        })

        // Send back the result through the success exit.
        return exits.success(playerInventory);

    }


};