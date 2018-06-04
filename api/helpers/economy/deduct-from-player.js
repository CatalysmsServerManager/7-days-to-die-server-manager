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
            deleteOldData(playerToDeductFrom.server);
            return exits.success();
        } catch (error) {
            sails.log.error(`HELPER economy:deduct-from-player - ${error}`);
            return exits.error(error);
        }
    }
};

async function deleteOldData(serverId) {
    try {
        let hoursToKeepData = 72
        let milisecondsToKeepData = hoursToKeepData * 3600000;
        let dateNow = Date.now();
        let borderDate = new Date(dateNow.valueOf() - milisecondsToKeepData);

        await HistoricalInfo.destroy({
            createdAt: { '<': borderDate.valueOf() },
            type: 'economy',
            server: serverId
        })

    } catch (error) {
        sails.log.error(error)
    }

}

