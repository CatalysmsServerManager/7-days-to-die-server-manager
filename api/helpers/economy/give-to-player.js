module.exports = {


    friendlyName: 'Give to player',


    description: 'Give a certain amount of currency to a player',


    inputs: {

        playerId: {
            type: 'number',
            description: 'Id of the server',
            required: true
        },

        amountToGive: {
            type: 'number',
            required: true
        }

    },


    exits: {
        success: {
            outputFriendlyName: 'Success',
        }
    },

    fn: async function (inputs, exits) {
        try {
            let playerToGiveTo = await Player.findOne(inputs.playerId);
            let currentBalance = playerToGiveTo.currency;
            let newBalance = currentBalance + inputs.amountToGive;
            await Player.update({id: playerToGiveTo.id}, {currency: newBalance});
        } catch (error) {
            sails.log.error(`HELPER economy:give-to-player - ${error}`);
            return exits.error(error);
        }
    }
};

