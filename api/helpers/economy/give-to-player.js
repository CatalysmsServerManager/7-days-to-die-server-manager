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
        },

        message: {
            type: 'string',
            maxLength: 500
        },

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
            let playerRole = await sails.helpers.sdtd.getPlayerRole(inputs.playerId);
            inputs.amountToGive = (inputs.amountToGive * playerRole.economyGiveMultiplier)
            let newBalance = currentBalance + inputs.amountToGive;


            await Player.update({ id: playerToGiveTo.id }, { currency: newBalance });
            await HistoricalInfo.create({
                server: playerToGiveTo.server,
                type: 'economy',
                message: inputs.message ? inputs.message : `Gave currency to player`,
                player: inputs.playerId,
                amount: inputs.amountToGive,
                economyAction: 'give'
            })

            let actionsCompleted = await sails.helpers.redis.get(`server:${playerToGiveTo.server}:economyActionsCompleted`);
            if (!actionsCompleted) {
                actionsCompleted = 1
            }
            await sails.helpers.redis.set(`server:${playerToGiveTo.server}:economyActionsCompleted`, parseInt(actionsCompleted) + 1);
            await sails.helpers.economy.deleteOldData(playerToGiveTo.server);

            return exits.success();
        } catch (error) {
            //sails.log.error(`HELPER economy:give-to-player - ${error}`);
            //return exits.error(error);
        }
    }
};