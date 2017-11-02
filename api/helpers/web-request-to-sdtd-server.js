module.exports = {


    friendlyName: 'Web request to sdtd server',


    description: 'Performs a web request to the specified api endpoint of a 7 Days to die server',


    inputs: {


        id: {
            type: "number",
            description: "ID of the server to get stats from",
            required: true
        },

        apiModule: {
            type: 'string',
            description: 'The API endpoint to send a request to',
            required: true
        },

        extraqs: {
            type: "json",
            description: "Extra parameters for the request"
        }
    },


    exits: {
        success: {
            outputFriendlyName: 'Request Data',
        },
        unauthorized: {
            outputFriendlyName: 'Access forbidden',
            description: "Server returned a 403 response. This usually indicates a problem with permissions (the web tokens)"
        },
        timeout: {
            outputFriendlyName: "Request timed out",
            description: "Server did not respond in time. Server offline?"
        }
    },


    fn: async function(inputs, exits) {
        const request = require("request-promise-native");
        const gameServer = await sails.models.sdtdserver.findOne(inputs.id);
        const ip = gameServer.ip;
        const port = gameServer.webPort;
        const authName = gameServer.authName;
        const authToken = gameServer.authToken;


        async function getRequestOptions(apiModule) {
            try {
                const baseUrl = "http://" + ip + ":" + port + "/api/";
                let requestOptions = {
                    url: baseUrl + apiModule,
                    json: true,
                    timeout: 5000,
                    headers: {
                        'User-Agent': 'Bill'
                    },
                    useQuerystring: true,
                    qs: {
                        adminuser: authName,
                        admintoken: authToken
                    }
                };
                if (inputs.extraqs) {
                    requestOptions.qs = Object.assign(requestOptions.qs, extraqs)
                }
                return requestOptions

            } catch (error) {
                sails.log("error")
            }
        }

        async function doRequest(apiModule) {
            let options = await getRequestOptions(apiModule)

            await request(options)
                .then(function(response) {
                    return exits.success(response)
                })
                .catch(function(error) {
                    return exits.unauthorized()
                })
        }
        doRequest(inputs.apiModule)

    }




};