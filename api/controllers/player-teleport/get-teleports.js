module.exports = {

    friendlyName: 'Get player teleports',

    description: '',

    inputs: {
        serverId: {
            type: 'number',
            required: true
        }
    },

    exits: {
        success: {
        },
    },


    fn: async function (inputs, exits) {

        let server = await SdtdServer.findOne(inputs.serverId).populate('players');
        if (!server) {
            return exits.success([])
        }
        let foundTeleports = await PlayerTeleport.find({player: server.players.map(player => player.id)}).populate('player')
        return exits.success(foundTeleports);

    }
};
