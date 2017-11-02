module.exports = {


    friendlyName: 'Get server info',

    description: 'Gets 7 days to die server info',


    inputs: {

        id: {
            type: "number",
            description: "ID of the server to get stats from",
            required: true
        }

    },


    exits: {

        success: {
            outputFriendlyName: 'Server info',
            outputExample: '==='
        }

    },


    fn: async function(inputs, exits) {

        // Get server info.
        var serverInfo = await sails.helpers.webRequestToSdtdServer({
            id: inputs.id,
            apiModule: "getserverinfo"
        })

        // Send back the result through the success exit.
        return exits.success(serverInfo);

    }


};