

module.exports = {


    friendlyName: 'Check donator status',


    description: 'Checks what donor features a server or user can use',


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

        if (_.isUndefined(inputs.serverId) && _.isUndefined(inputs.userId)) {
            throw new Error(`Usage error! Must give atleast one of the arguments`);
        }

        if (!_.isUndefined(inputs.serverId)) {
            try {
                let server = await SdtdServer.findOne(inputs.serverId).populate('owner');
                foundUser = developerGuild.members.get(server.owner.discordId);
                if (!_.isUndefined(foundUser)) {
                    discordUser = foundUser
                }
            } catch (error) {
                sails.log.error(error)
            }
        }

        if (!_.isUndefined(inputs.userId)) {
            try {
                let user = await User.findOne(inputs.userId);
                foundUser = developerGuild.members.get(user.discordId);
                if (!_.isUndefined(foundUser)) {
                    discordUser = foundUser
                }
            } catch (error) {
                sails.log.error(error)
            }
        }

        if (_.isUndefined(discordUser)) {
            return exits.success('donator')
        }

        let patronRole = await developerGuild.roles.get("410545564913238027");
        let donatorRole = await developerGuild.roles.get("434462571978948608");
        let contributorRole = await developerGuild.roles.get("434462681068470272");
        let sponsorRole = await developerGuild.roles.get("434462786962325504");

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
