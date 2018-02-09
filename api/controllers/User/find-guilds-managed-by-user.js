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
  
        let discordClient = sails.hooks.discordbot.getClient();
        let foundUser = await User.findOne(inputs.userId);
        
        if (_.isUndefined(foundUser) || _.isUndefined(foundUser.discordId)) {
            return exits.badRequest();
        }
        
        let discordUser = discordClient.users.get(foundUser.discordId);
        let foundGuilds = discordClient.guilds.filter(guild => {
            let member = guild.members.get(discordUser.id);
            if (_.isUndefined(member)) {
                return false;
            }
            return member.hasPermission("MANAGE_GUILD");
        })

        let foundGuildsArray = Array.from(foundGuilds.values());
        
        exits.success(foundGuildsArray);
        sails.log.debug(`API - SdtdServer:find-guilds-managed-by-user - Found ${foundGuildsArray.length} guilds for user ${inputs.userId}!`);
      } catch (error) {
        sails.log.error(`API - SdtdServer:find-guilds-managed-by-user - ${error}`);
        return exits.error(error);
      }
  
    }
  
  
  };
  