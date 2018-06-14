module.exports = {


    friendlyName: 'Cron export',


    description: '',


    inputs: {
        serverId: {
            type: 'number',
            required: true,
            custom: async (valueToCheck) => {
                let foundServer = await SdtdServer.findOne(valueToCheck);
                return foundServer
            },
        }

    },


    exits: {
        success: {},

        invalidIds: {
            description: "Must give either listing or server ID",
            responseType: 'badRequest',
            statusCode: 400
        }
    },


    fn: async function (inputs, exits) {

        try {

            let foundCommands = await CustomCommand.find({
                server: inputs.serverId
            });

            this.res.attachment(`commands.json`);

            let jsonExport = JSON.stringify(foundCommands.map(command => {
                command = _.omit(command, "createdAt", "updatedAt", "id", "server", "aliases");
                return command
            }));

            return exits.success(jsonExport);
        } catch (error) {
            sails.log.error(error);
            return exits.error(error);
        }




    }


};
