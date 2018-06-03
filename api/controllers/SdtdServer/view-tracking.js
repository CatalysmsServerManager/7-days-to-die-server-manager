module.exports = {


    friendlyName: 'Get tracking view',
  
  
    inputs: {
      serverId: {
        required: true,
        example: 4,
      }
    },
  
  
    exits: {
      success: {
        responseType: 'view',
        viewTemplatePath: 'sdtdServer/tracking'
      }
  
    },
  
  
    fn: async function (inputs, exits) {
  
      try {
        let server = await SdtdServer.findOne({
          id: inputs.serverId
        });
        let players = await Player.find({server: server.id});

  
        sails.log.info(`Showing tracking for ${server.name} - ${players.length} players`);
  
        exits.success({
          players: players,
          server: server
        });
      } catch (error) {
        sails.log.error(error);
      }
  
    }
  
  
  };
  