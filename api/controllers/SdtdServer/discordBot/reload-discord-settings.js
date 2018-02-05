module.exports = {


  friendlyName: 'Reload discord settings',


  description: 'Update and reload settings for the discord bot',


  inputs: {
    newGuildName: {
      required: true,
      example: 'CSMM Dev'
    },
    serverId: {
      required: true,
      example: 24
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
   * @name reload-discord-settings
   * @param {number} newGuildId discord guild id
   * @returns {array}
   */

  fn: async function (inputs, exits) {
    sails.log.debug(`API - SdtdServer:reload-discord-settings - Reloading settings for server ${inputs.serverId}!`);
    try {

      let server = await SdtdServer.findOne(inputs.serverId);

      let discordClient = sails.hooks.discordbot.getClient();
      let newGuild = discordClient.guilds.find('name', inputs.newGuildName)

      if (!_.isUndefined(newGuild)) {
        await SdtdServer.update({
          id: inputs.serverId
        }, {
          discordGuildId: newGuild.id
        });
        sails.log.debug(`API - SdtdServer:reload-discord-settings - updated discord guild ID for server ${inputs.serverId} to ${inputs.newGuildName}`);
        exits.success();
      } else {
        exits.error(new Error(`Bot is not in selected guild!`));
      }


    } catch (error) {
      sails.log.error(`API - SdtdServer:reload-discord-settings - ${error}`);
      return exits.error(error);
    }

  }


};
