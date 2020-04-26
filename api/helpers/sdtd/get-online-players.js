var sevenDays = require('7daystodie-api-wrapper');
const validator = require('validator');

module.exports = {


    friendlyName: 'Get online players',


    description: '',


    inputs: {

        serverId: {
            type: 'number',
            required: true,
            description: 'Id of the server',
        }

    },


    exits: {
        success: {
            outputFriendlyName: 'Success',
        }
    },

    fn: async function (inputs, exits) {
        let server = await SdtdServer.findOne({ id: inputs.serverId });
        try {
          response = await sevenDays.getOnlinePlayers(SdtdServer.getAPIConfig(server))
          return exits.success(response);
        } catch (err) {
          sails.log.warn(`Error getting online players for server ${server.name}`, err)
          return exits.success([]);
        }
    }


};



