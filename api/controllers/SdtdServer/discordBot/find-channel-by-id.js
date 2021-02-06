module.exports = {


  friendlyName: 'Find channel by id',


  description: '',


  inputs: {
    guildId: {
      required: true,
      example: '336821518250147850'
    },

    channelId: {
      required: true,
      example: '336821518250147850'
    }

  },

  exits: {
    badRequest: {
      responseType: 'badRequest'
    }
  },


  fn: async function (inputs, exits) {
    try {

      let discordClient = sails.helpers.discord.getClient();

      let foundChannel = await discordClient.channels.cache.get(inputs.channelId);

      return exits.success(foundChannel);

    } catch (error) {
      sails.log.error(`API - SdtdServer:find-channel-by-id - ${error}`);
      return exits.error(error);
    }

  }


};
