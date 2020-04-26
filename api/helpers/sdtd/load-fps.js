var sevenDays = require('7daystodie-api-wrapper');

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
        try {
            let fps = await sails.helpers.redis.get(`server:${inputs.serverId}:fps`);
            return exits.success(fps);
          } catch (error) {
            return exits.success(0)
          }
    }


};
