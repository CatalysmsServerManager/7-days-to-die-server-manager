module.exports = {


  friendlyName: 'Check if bot is in guild',


  description: 'Checks if the discord bot is in a discord guild with given ID.',


  inputs: {
    guildId: {
      required: true,
      example: '336821518250147850'
    }

  },

  exits: {
    badRequest: {
      responseType: 'badRequest'
    }
  },

  /**
     * @memberof SdtdServer
     * @method
     * @name check-if-bot-is-in-guild
     * @param {number} guildId discord guild id
     * @returns {array}
     */

  fn: async function (inputs, exits) {
    sails.log.debug(`API - SdtdServer:check-if-bot-is-in-guild - Check if the bot is in server ${inputs.guildId}!`);
    try {

      let discordClient = sails.helpers.discord.getClient();

      exits.success(discordClient.guilds.cache.has(inputs.guildId));

    } catch (error) {
      sails.log.error(`API - SdtdServer:check-if-bot-is-in-guild - ${error}`);
      return exits.error(error);
    }

  }


};
