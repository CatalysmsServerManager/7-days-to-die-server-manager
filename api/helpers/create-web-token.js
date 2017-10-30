module.exports = {


    friendlyName: 'Create web token',


    description: 'Takes a telnet connection, adds webtokens to the server and returns these',


    inputs: {

        telnetConnection: {
            type: "ref",
            description: "Telnet connection with a sdtd Server",
            required: true
        }

    },


    exits: {

    },


    fn: async function(inputs, exits) {
        const randToken = require("rand-token")

        let connection = inputs.telnetConnection

        const authName = "CSMM";
        const authToken = randToken.generate(32)

        try {
            let result = await connection.exec(`webtokens add ${authName} ${authToken} 0`)
            return exits.success({ authName: authName, authToken: authToken })

        } catch (error) {
            return exits.error(error)
        }


    }


};