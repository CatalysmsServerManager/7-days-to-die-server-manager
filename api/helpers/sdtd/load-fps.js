var sevenDays = require('machinepack-7daystodiewebapi');

module.exports = {


    friendlyName: 'Load fps',


    description: 'Loads a servers FPS.',


    inputs: {

        serverId: {
            type: 'number',
            description: 'Id of the server',
            required: true
        }

    },


    exits: {
        success: {
            outputFriendlyName: 'Success',
            outputType: 'json'
        },

        notAvailable: {
            outputFriendlyName: 'Not available',
            description: 'The server could not be reached'
        }
    },

    /**
     * @name loadFps
     * @memberof module:Helpers
     * @method
     * @param {number} serverId
     */

    fn: async function (inputs, exits) {
        let server = await SdtdServer.findOne(inputs.serverId);

        sevenDays.executeCommand({
            ip: server.ip,
            port: server.webPort,
            authName: server.authName,
            authToken: server.authToken,
            command: 'mem'
        }).exec({
            success: function (data) {
                try {
                    var tempData = data.result.split(" ");
                    var fpsIdx = tempData.findIndex(dataEntry => {
                        return dataEntry == 'FPS:'
                    });
                    return exits.success(tempData[fpsIdx + 1])
                } catch (error) {
                    return exits.error(error)
                }

            },
            error: err => {
                return exits.error();
            }
        })

    }


};
