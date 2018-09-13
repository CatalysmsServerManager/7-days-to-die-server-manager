module.exports = {

    friendlyName: 'Player Profile',
  
    description: 'Show profile of a SdtdPlayer',
  
    inputs: {
      steamId: {
        description: 'The ID of the player',
        type: 'string',
        required: true
      }
    },
  
    exits: {
      success: {
        responseType: 'view',
        viewTemplatePath: 'player/gbl'
      },
      notFound: {
        description: 'No player with the specified ID was found in the database.',
        responseType: 'notFound'
      },
  
    },
  
  
    fn: async function (inputs, exits) {
  
      let players = await Player.find({steamId: inputs.steamId}).populate('server');
      let banEntries = await BanEntry.find({steamId: inputs.steamId});
  
      sails.log.info(`Loading player GBL ${inputs.steamId} for user ${this.req.session.user.id}`);
      return exits.success({
        players: players,
        banEntries: banEntries,
        steamId: inputs.steamId
      });
    }
  };
  