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

      const discordClient = sails.helpers.discord.getClient();
      const foundUser = await User.findOne(inputs.userId);

      if (_.isUndefined(foundUser) || '' === foundUser.discordId) {
        return exits.badRequest();
      }

      const discordUser = await discordClient.users.fetch(foundUser.discordId);

      if (discordUser === undefined || discordUser === null) {
        return exits.badRequest();
      }

      const foundGuilds = [];

      for (const guild of discordClient.guilds.cache.array()) {
        let member;
        try {
          member = await guild.members.fetch(discordUser.id);
        } catch (e) {
          // User is not in guild, skipping
          continue;
        }

        if (!member) {
          // Should error out on the previous call
          // This is a safety to make sure member is defined before continuing
          continue;
        }
        if (member.hasPermission('MANAGE_GUILD')) {
          foundGuilds.push(guild);
        }
      }

      sails.log.debug(`API - SdtdServer:find-guilds-managed-by-user - Found ${foundGuilds.length} guilds for user ${inputs.userId}!`, {userId: inputs.userId});
      return exits.success(foundGuilds);
    } catch (error) {
      sails.log.error(`API - SdtdServer:find-guilds-managed-by-user - ${error}`, {userId: inputs.userId});
      return exits.error(error);
    }

  }


};
