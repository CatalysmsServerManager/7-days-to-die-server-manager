module.exports = {

    friendlyName: 'Set Vote for server Currency Reward',

    inputs: {
        serverId: {
            type: 'number',
            required: true
        },

        rewardAmount: {
            type: 'number',
            required: true
        }
    },

    exits: {
        success: {
        },
    },


    fn: async function (inputs, exits) {

        await SdtdConfig.update({ server: inputs.serverId }, { voteForServerCurrencyReward: inputs.rewardAmount });
        sails.log.info(`Set Vote for server Currency Reward to ${inputs.rewardAmount} for server ${inputs.serverId}`);
        return exits.success();

    }
};
