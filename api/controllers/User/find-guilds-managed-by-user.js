const { PermissionFlagsBits } = require('discord.js');

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

      const filteredGuilds = (await Promise.all(discordClient.guilds.cache.map(async g => {
        try {
          const member = await g.members.fetch(discordUser.id);
          if (member && member.permissions.has(PermissionFlagsBits.ManageGuild)) {
            return g;
          }
        } catch (error) {
          if (error.message.includes('Unknown Member')) { return null; }
          throw error;
        }

      }))).filter(Boolean);

      sails.log.debug(`API - SdtdServer:find-guilds-managed-by-user - Found ${filteredGuilds.length} guilds for user ${inputs.userId}!`, { userId: inputs.userId });
      return exits.success(filteredGuilds);
    } catch (error) {
      sails.log.error(`API - SdtdServer:find-guilds-managed-by-user - ${error}`, { userId: inputs.userId });
      return exits.error(error);
    }

  }


};
