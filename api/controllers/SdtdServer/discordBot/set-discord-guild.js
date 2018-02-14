module.exports = {

  friendlyName: 'Set discord guild',

  description: 'Set the discordGuildId for a SdtdServer',

  inputs: {
    discordGuildId: {
      required: true,
      type: 'string'
    },
    serverId: {
      required: true,
      type: 'string'
    }
  },

  exits: {
    success: {},
    badGuild: {
      responseType: 'badRequest'
    },
    notFound: {
        responseType: 'notFound'
    }
  },


  fn: async function (inputs, exits) {

    try {
      let server = await SdtdServer.findOne(inputs.serverId);
      let discordClient = sails.hooks.discordbot.getClient();

      if (!discordClient.guilds.has(inputs.discordGuildId)) {
        return exits.badGuild();
      }

      if (_.isUndefined(server)){
        return exits.notFound()
      }

      await SdtdConfig.update({
        server: inputs.serverId
      }, {
        discordGuildId: inputs.discordGuildId
      })

      sails.log.debug(`API - SdtdServer:set-discord-guid - set guild ${inputs.discordGuildId} for server ${inputs.serverId}`);
      return exits.success();
    } catch (error) {
      sails.log.error(`API - SdtdServer:set-discord-guid - ${error}`);
      return exits.error(error);
    }
  }
};
