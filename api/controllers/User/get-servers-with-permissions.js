module.exports = {

    friendlyName: 'Get servers with permissions',
  
    description: 'Find servers for which this user has some permissions',
  
    inputs: {
      userId: {
        description: 'The ID of the user to look up.',
        type: 'number',
        required: true
      }
    },
  
    exits: {
      success: {},
      notFound: {
        description: 'No player with the specified ID was found in the database.',
        responseType: 'notFound'
      }
    },
  

    fn: async function (inputs, exits) {
      sails.log.debug(`API - User:getServersWithPermissions - Getting servers with permissions for user ${inputs.userId}`);
  
      try {
        let foundUser = await User.findOne({id: inputs.userId});
        
        let players = await Player.find({steamId: foundUser.steamId}).populate('role').populate('server');

        let objectToSend = new Array();

        players.map(player => {
          try {
            player.server.role = player.role;
            objectToSend.push(player.server);
          } catch (error) {
            sails.log.error(error)
          }

        })

        return exits.success(objectToSend);
  
      } catch (error) {
        sails.log.error(`API - User:getServersWithPermissions - ${error}`);
        return exits.error(error);
      }
  
    }
  };
  