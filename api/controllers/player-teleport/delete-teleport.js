module.exports = {

    friendlyName: 'Delete a teleport',

    description: '',

    inputs: {
        teleportId: {
            type: 'number',
            required: true
        }
    },

    exits: {
        success: {
        },
    },


    fn: async function (inputs, exits) {

        await PlayerTeleport.destroy({id: inputs.teleportId});
        return exits.success();

    }
};
