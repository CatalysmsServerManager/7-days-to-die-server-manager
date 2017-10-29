module.exports = {


    friendlyName: 'Connect to telnet',


    description: 'Connect to a servers telnet',


    inputs: {
        id: {
            type: 'number',
            description: "ID of server to initialize",
            required: true
        }

    },


    exits: {

    },


    fn: async function(inputs, exits) {


        sails.log(`Connecting to telnet of server with id ${inputs.id}`)
            // All done.
        return exits.success();

    }


};