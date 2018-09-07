module.exports = {


    friendlyName: 'Deduct from player',


    description: 'Take a certain amount of currency to a player',


    inputs: {

        playerId: {
            type: 'number',
            description: 'Id of the server',
            required: true
        },

        amountToDeduct: {
            type: 'number',
            required: true
        },

        message: {
            type: 'string',
            maxLength: 500
        },

    },


    exits: {
        success: {
            outputFriendlyName: 'Success',
        },
        notEnoughCurrency: {
            description: 'Player did not have enough currency in balance to deduct this amount'
        }
    },

    fn: async function (inputs, exits) {
        try {
            let playerToDeductFrom = await Player.findOne(inputs.playerId);
            let currentBalance = playerToDeductFrom.currency;
            let newBalance = currentBalance - inputs.amountToDeduct;

            if (newBalance < 0) {
                return exits.notEnoughCurrency(Math.abs(newBalance));
            }

            await Player.update({ id: playerToDeductFrom.id }, { currency: newBalance });
            await HistoricalInfo.create({
                server: playerToDeductFrom.server,
                type: 'economy',
                message: inputs.message ? inputs.message : `Deducted currency from player`,
                player: inputs.playerId,
                amount: inputs.amountToDeduct,
                economyAction: 'deduct'
            })
            
            let actionsCompleted = await sails.helpers.redis.get(`server:${playerToDeductFrom.server}:economyActionsCompleted`);
            if (!actionsCompleted) {
                actionsCompleted = 1
            }
            await sails.helpers.redis.set(`server:${playerToDeductFrom.server}:economyActionsCompleted`, parseInt(actionsCompleted) + 1);
            await sails.helpers.economy.deleteOldData(playerToDeductFrom.server);

            return exits.success();
        } catch (error) {
            sails.log.error(`HELPER economy:deduct-from-player - ${error}`);
            return exits.error(error);
        }
    }
};

