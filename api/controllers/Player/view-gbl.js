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

    let players = await Player.find({
      steamId: inputs.steamId
    }).populate('server');
    let banEntries = await BanEntry.find({
      steamId: inputs.steamId
    }).populate('server').populate('comments')

    let comments = await GblComment.find({
      ban: banEntries.map(ban => ban.id)
    }).populate('user');

    let steamProfile = await sails.helpers.steam.getProfile(inputs.steamId);
    steamProfile = steamProfile[0];

    sails.log.info(`Loading player GBL ${inputs.steamId} - ${steamProfile.personaname} for user ${this.req.session.user.id}`);
    return exits.success({
      players: players,
      banEntries: banEntries,
      comments: comments,
      steamId: inputs.steamId,
      steamProfile: steamProfile
    });
  }
};
