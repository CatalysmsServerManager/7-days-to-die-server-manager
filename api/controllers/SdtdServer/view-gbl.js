module.exports = {


    friendlyName: 'Get global ban list view',
  
  
    inputs: {

    },
  
  
    exits: {
      success: {
        responseType: 'view',
        viewTemplatePath: 'sdtdServer/global-ban-list'
      }
  
    },
  
  
    fn: async function (inputs, exits) {
  
      try {

        let foundUser = await User.findOne({id: this.req.session.userId}).populate('adminOf').populate('servers');
        let ownedServers = foundUser.servers.concat(foundUser.adminOf);
        ownedServers = _.uniqBy(ownedServers, "id");

        for (const server of ownedServers) {
            await sails.helpers.sdtd.loadBans(server.id);
        }

        sails.log.info(`Showing global ban list to user ${foundUser.name}`);
  
        exits.success();

      } catch (error) {
        sails.log.error(error);
      }
  
    }
  
  
  };
  