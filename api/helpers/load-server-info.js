var sevenDays = require('machinepack-7daystodiewebapi');

module.exports = {


    friendlyName: 'Load server info',


    description: 'Performs an API request to a sdtd server and saves the info to DB',


    inputs: {
        serverId: {
            friendlyName: 'Server ID',
            required: true,
            example: 1
        }
    },


    exits: {
        success: {
            outputFriendlyName: 'Success'
        },
        connectionError: {
            description: 'Could not connect to the 7 days to die server'
        },
        databaseError: {
            description: 'Error reading or writing data to DB'
        }
    },


    fn: async function(inputs, exits) {

        // All done.



        return exits.success();

    }


};