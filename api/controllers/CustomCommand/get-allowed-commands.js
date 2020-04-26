var sevenDays = require('7daystodie-api-wrapper');

module.exports = {

    friendlyName: 'Get allowed commands',

    description: '',

    inputs: {
        serverId: {
            type: 'number',
            required: true
        },
    },

    exits: {
        success: {},

    },


    fn: async function (inputs, exits) {

        try {
            let server = await SdtdServer.findOne(inputs.serverId);
            let allowedCommands = await getAllowedCommands(server);

            return exits.success(allowedCommands);

        } catch (error) {
            sails.log.error(`${error}`);
            return exits.error(error);
        }


    }
};



async function getAllowedCommands(server) {
  const response = await sevenDays.getAllowedCommands(SdtdServer.getAPIConfig(server))


  let allowedCommands = new Array();
  response.commands.forEach(command => {
    allowedCommands.push(command.command)
  })
  return allowedCommands;
}
