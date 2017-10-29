module.exports = {


    friendlyName: 'Web request to sdtd server',


    description: 'Performs a web request to the specified api endpoint of a 7 Days to die server',


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
        },
        apiModule: {
            type: 'string',
            description: 'The API endpoint to send a request to',
            required: true
        }
    },


    exits: {
        success: {
            outputFriendlyName: 'Request Data',
        }
    },


    fn: async function(inputs, exits) {
        const request = require("request-promise-native");

        async function getRequestOptions(apiModule) {
            try {
                const baseUrl = "http://" + inputs.ip + ":" + inputs.port + "/api/";
                let requestOptions = {
                    url: baseUrl + apiModule,
                    json: true,
                    timeout: 5000,
                    headers: {
                        'User-Agent': 'Bill'
                    },
                    useQuerystring: true,
                    qs: {
                        adminuser: inputs.authName,
                        admintoken: inputs.authToken
                    }
                };
                return requestOptions

            } catch (error) {
                sails.log("error")
            }
        }

        async function doRequest(apiModule) {
            let options = await getRequestOptions(apiModule)

            return request(options)
                .then(function(response) {
                    return exits.success(response)
                })
                .catch(function(error) {
                    sails.log(error)
                })
        }
        doRequest(inputs.apiModule)

    }




};