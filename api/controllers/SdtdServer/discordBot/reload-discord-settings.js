module.exports = {


    friendlyName: 'Reload discord settings',
  
  
    description: 'Update and reload settings for the discord bot',
  
  
    inputs: {
      newGuildName: {
        required: true,
        example: '336821518250147850'
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

        if (discordClient.guilds.has(inputs.newGuildId)) {
            await SdtdServer.update({id: inputs.serverId}, {discordGuildId: inputs.newGuildId});
            sails.log.debug(`API - SdtdServer:reload-discord-settings - updated discord guild ID for server ${inputs.serverId} to ${inputs.newGuildId}`);
            exits.success();
        }

        exits.error(new Error(`Bot is not in selected guild!`));
  
      } catch (error) {
        sails.log.error(`API - SdtdServer:reload-discord-settings - ${error}`);
        return exits.error(error);
      }
  
    }
  
  
  };
  