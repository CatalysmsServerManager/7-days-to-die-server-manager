module.exports = {


    friendlyName: 'Get stats',


    description: 'Returns data from a web request to 7 days to die server\'s /api/getstats',


    inputs: {

        ip: {
            type: 'string',
            description: 'IP address of the server to send the request',
            required: true
        },
        port: {
            type: 'string',
            description: 'Web port of the server to send the request',
            required: true
        },
        authName: {
            type: 'string',
            description: 'Authorization name of the server to send the request',
            required: true
        },
        authToken: {
            type: 'string',
            description: 'Authorization token of the server to send the request',
            required: true
        }


    },


    exits: {

        success: {
            outputFriendlyName: 'Stats',
            outputExample: {
                "gametime": {
                    "days": 1,
                    "hours": 7,
                    "minutes": 27
                },
                "players": 0,
                "hostiles": 0,
                "animals": 0
            }
        }

    },


    fn: async function(inputs, exits) {
        // Get stats.
        var stats

        stats = await sails.helpers.webRequestToSdtdServer({
            ip: inputs.ip,
            port: inputs.port,
            authName: inputs.authName,
            authToken: inputs.authToken,
            apiModule: "getstats"
        })

        // Send back the result through the success exit.
        return exits.success(stats);

    }


};