module.exports = {


  friendlyName: 'Get donator status',


  description: 'Get the donator status of a user or server.',


  inputs: {

    serverId: {
      type: 'number'
    },
    userId: {
      type: 'number'
    },

  },


  exits: {

  },


  fn: async function (inputs, exits) {

    let discordClient = sails.hooks.discordbot.getClient();
    let developerGuild = discordClient.guilds.get(sails.config.custom.donorConfig.devDiscordServer);
    let discordUser = undefined;

    if (_.isUndefined(developerGuild)) {
      return exits.success('free');
    }

    if (_.isUndefined(inputs.serverId) && _.isUndefined(inputs.userId)) {
      throw new Error(`Usage error! Must give atleast one of the arguments`);
    }

    if (!_.isUndefined(inputs.serverId)) {
      try {
        let server = await SdtdServer.findOne(inputs.serverId).populate('owner');

        if (_.isEmpty(server.owner.discordId)) {
          return exits.success('free');
        }

        foundUser = await developerGuild.fetchMember(server.owner.discordId);
        discordUser = foundUser;

      } catch (error) {
        sails.log.error(error)
      }
    }

    if (!_.isUndefined(inputs.userId)) {
      try {
        let user = await User.findOne(inputs.userId);

        if (_.isEmpty(user.discordId)) {
          return exits.success('free');
        }

        foundUser = await developerGuild.fetchMember(user.discordId);
        if (!_.isUndefined(foundUser)) {
          discordUser = foundUser
        }
      } catch (error) {
        sails.log.error(error)
      }
    }

    if (_.isUndefined(discordUser)) {
      return exits.success('free')
    }

    const patronRole = await developerGuild.roles.get("410545564913238027");
    const donatorRole = await developerGuild.roles.get("434462571978948608");
    const contributorRole = await developerGuild.roles.get("434462681068470272");
    const sponsorRole = await developerGuild.roles.get("434462786962325504");
    const premiumRole = await developerGuild.roles.get("615198219122507786");
    const enterpriseRole = await developerGuild.roles.get("615198261069873154");

    if (discordUser.roles.has(enterpriseRole.id)) {
      return exits.success('enterprise')
    }

    if (discordUser.roles.has(premiumRole.id)) {
      return exits.success('premium')
    }

    if (discordUser.roles.has(sponsorRole.id)) {
      return exits.success('sponsor')
    }

    if (discordUser.roles.has(contributorRole.id)) {
      return exits.success('contributor')
    }

    if (discordUser.roles.has(donatorRole.id)) {
      return exits.success('donator')
    }

    if (discordUser.roles.has(patronRole.id)) {
      return exits.success('patron')
    }

    return exits.success('free')

  }


};
