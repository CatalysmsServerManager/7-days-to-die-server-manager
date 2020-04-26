const sevenDaysAPI = require("7daystodie-api-wrapper");
module.exports = {


    friendlyName: 'Load land claims',


    description: '',


    inputs: {

        serverId: {
            type: 'number',
            required: true,
            custom: async (valueToCheck) => {
                let foundServer = await SdtdServer.findOne(valueToCheck);
                return foundServer
            },
        },

        playerId: {
            type: 'number',
            custom: async (valueToCheck) => {
                let foundPlayer = await Player.findOne(valueToCheck);
                return foundPlayer
            },
        },

    },


    exits: {
    },


    fn: async function (inputs, exits) {

        let server = await SdtdServer.findOne(inputs.serverId);

        let steamId = null;

        if (inputs.playerId) {
            let player = await Player.findOne(inputs.playerId);
            steamid = player.steamId
        }

        return sevenDaysAPI.getLandClaims(SdtdServer.getAPIConfig(server), steamId);
    }
};
