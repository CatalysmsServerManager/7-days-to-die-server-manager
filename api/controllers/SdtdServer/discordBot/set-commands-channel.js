module.exports = {


    friendlyName: 'Set the channel to use for commands for a server',


    description: '',


    inputs: {
        channelId: {
            required: true,
            example: '336821518250147850'
        },
        serverId: {
            required: true,
            example: '5'
        }

    },

    exits: {
        badChannel: {
            responseType: 'badRequest'
        }
    },

    /**
       * @memberof SdtdServer
       * @method
       * @name set-commands-channel
       * @param {number} channelId Discord channel ID
       * @returns {array}
       */

    fn: async function (inputs, exits) {

        let discordClient = sails.hooks.discordbot.getClient();
        if (!discordClient.channels.has(inputs.channelId)) {
            return exits.badChannel()
        }

        try {
            let server = await SdtdServer.findOne({id: inputs.serverId});
            let channel = discordClient.channels.get(inputs.channelId);
            await channel.send(`:white_check_mark: Set this channel to use commands for ${server.name}.`);
            await SdtdConfig.update({ server: inputs.serverId }, { discordCommandsChannelId: inputs.channelId });
            return exits.success();
        } catch (error) {
            return exits.badChannel();
        }
    }

};
