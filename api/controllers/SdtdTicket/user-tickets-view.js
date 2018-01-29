module.exports = {


    friendlyName: 'User tickets view',
  
  
    description: 'Loads relevant ticket data, and serves the view',
  
  
    inputs: {
      userId: {
        type: 'string',
        required: true
      }
    },
  
  
    exits: {
  
      notFound: {
        description: 'Server with given ID not found in the system',
        responseType: 'notFound'
      },
      success: {
        description: "",
        responseType: 'view',
        viewTemplatePath: 'sdtdServer/tickets'
      }
  
    },
  
    /**
     * @memberof SdtdServer
     * @name user-tickets-view
     * @method
     * @description Loads relevant ticket data, and serves the view
     * @param {string} userId
     */
  
  
    fn: async function (inputs, exits) {
  
      try {
        sails.log.debug(`API - SdtdServer:user-tickets-view - Loading tickets view for user ${inputs.userId}`);
  
        let user = await User.findOne({
          id: inputs.userId
        }).populate('players');

        let playerIds = new Array();

        user.players.forEach((player) => {
            playerIds.push(player.id)
        })
      
        tickets = await SdtdTicket.find({
            player: playerIds
        })
        
        sails.log.debug(`API - SdtdServer:user-tickets-view - Success, loaded ${tickets.length} tickets`);
        return exits.success({
          user: user,
          tickets: tickets
        })
  
      } catch (error) {
        sails.log.error(`API - SdtdServer:user-tickets-view - ${error}`);
        return exits.error(error)
      }
  
  
    }
  
  
  };
  