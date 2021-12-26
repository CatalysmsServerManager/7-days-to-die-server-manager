module.exports = {
  friendlyName: 'Get donator status',

  description: 'Get the donator status of a user or server.',

  inputs: {
    serverId: {
      type: 'number'
    },
    userId: {
      type: 'number'
    }
  },

  exits: {},

  fn: async function (inputs, exits) {
    switch (process.env.CSMM_DONATOR_TIER) {
      case 'free':
        return exits.success('free');
      case 'patron':
        return exits.success('patron');
      case 'donator':
        return exits.success('donator');
      case 'contributor':
        return exits.success('contributor');
      case 'sponsor':
        return exits.success('sponsor');
      case 'premium':
        return exits.success('premium');
      case 'enterprise':
        return exits.success('enterprise');
      default:
        break;
    }

    let discordClient = sails.helpers.discord.getClient();
    let developerGuild = await discordClient.guilds.fetch(
      sails.config.custom.donorConfig.devDiscordServer,
      true,
      false
    );
    let discordUser = undefined;

    if (_.isUndefined(developerGuild)) {
      return exits.success('free');
    }

    if (_.isUndefined(inputs.serverId) && _.isUndefined(inputs.userId)) {
      throw new Error(`Usage error! Must give atleast one of the arguments`);
    }

    if (!_.isUndefined(inputs.serverId)) {
      try {
        let server = await SdtdServer.findOne(inputs.serverId).populate(
          'owner'
        );

        if (_.isEmpty(server.owner.discordId)) {
          return exits.success('free');
        }

        foundUser = await developerGuild.members.fetch({user: server.owner.discordId, force: true});
        discordUser = foundUser;
      } catch (error) {
        sails.log.error(error, {userId: inputs.userId, serverId: inputs.serverId});
      }
    }

    if (!_.isUndefined(inputs.userId)) {
      try {
        let user = await User.findOne(inputs.userId);

        if (_.isEmpty(user.discordId)) {
          return exits.success('free');
        }

        foundUser = await developerGuild.members.fetch({user: user.discordId, force: true});
        if (!_.isUndefined(foundUser)) {
          discordUser = foundUser;
        }
      } catch (error) {
        sails.log.error(error, {userId: inputs.userId, serverId: inputs.serverId});
      }
    }

    if (_.isUndefined(discordUser)) {
      return exits.success('free');
    }

    const patronRole = await developerGuild.roles.cache.get('410545564913238027');
    const donatorRole = await developerGuild.roles.cache.get('434462571978948608');
    const contributorRole = await developerGuild.roles.cache.get(
      '434462681068470272'
    );
    const sponsorRole = await developerGuild.roles.cache.get('434462786962325504');
    const premiumRole = await developerGuild.roles.cache.get('615198219122507786');
    const enterpriseRole = await developerGuild.roles.cache.get('615198261069873154');

    if (discordUser.roles.cache.has(enterpriseRole.id)) {
      return exits.success('enterprise');
    }

    if (discordUser.roles.cache.has(premiumRole.id)) {
      return exits.success('premium');
    }

    if (discordUser.roles.cache.has(sponsorRole.id)) {
      return exits.success('sponsor');
    }

    if (discordUser.roles.cache.has(contributorRole.id)) {
      return exits.success('contributor');
    }

    if (discordUser.roles.cache.has(donatorRole.id)) {
      return exits.success('donator');
    }

    if (discordUser.roles.cache.has(patronRole.id)) {
      return exits.success('patron');
    }

    return exits.success('free');
  }
};
