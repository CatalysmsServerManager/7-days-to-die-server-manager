module.exports = {


  friendlyName: 'Find guilds managed by user',


  description: '',


  inputs: {
    userId: {
      required: true,
      example: '1337'
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
       * @name find-guilds-managed-by-user
       * @param {number} userId
       * @returns {array}
       */

  fn: async function (inputs, exits) {

    try {

      const discordClient = sails.hooks.discordbot.getClient();
      const foundUser = await User.findOne(inputs.userId);

      if (_.isUndefined(foundUser) || '' === foundUser.discordId) {
        return exits.badRequest();
      }

      const discordUser = await discordClient.users.fetch(foundUser.discordId);

      if (discordUser === undefined || discordUser === null) {
        return exits.badRequest();
      }

      const foundGuilds = discordClient.guilds.cache.filter(async guild => {
        const member = await guild.members.fetch(discordUser.id);
        if (!member) {
          return false;
        }
        return member.hasPermission('MANAGE_GUILD');
      });

      const foundGuildsArray = Array.from(foundGuilds.values());

      sails.log.debug(`API - SdtdServer:find-guilds-managed-by-user - Found ${foundGuildsArray.length} guilds for user ${inputs.userId}!`);
      return exits.success(foundGuildsArray);
    } catch (error) {
      sails.log.error(`API - SdtdServer:find-guilds-managed-by-user - ${error}`);
      return exits.error(error);
    }

  }


};
