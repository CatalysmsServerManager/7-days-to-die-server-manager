module.exports = {


  friendlyName: 'Search by steamID',


  description: 'Search the GBL by steam ID',


  inputs: {

    steamId: {
      required: true,
      type: 'string',
    },

  },


  exits: {
    badRequest: {
      description: '',
      statusCode: 400
    },

    notAuthorized: {
      description: '',
      statusCode: 403
    }
  },


  fn: async function (inputs, exits) {

    let loggedInUser = this.req.session.user;

    if (_.isUndefined(loggedInUser)) {
      return exits.badRequest();
    }

    let foundBans = await BanEntry.find({
      steamId: inputs.steamId
    }).populate('server').populate('comments');

    // loads comment user info
    foundBans = foundBans.map(async ban => {

      ban.comments = ban.comments.map(async comment => {
        comment = await GblComment.findOne(comment.id).populate('user').populate('heartedBy');

        return comment
      });

      return new Promise((resolve => {
        Promise.all(ban.comments).then(completed => {
            ban.comments = completed
            resolve(ban);
          });
      }))



    })

    Promise.all(foundBans).then(filledBans => {
      sails.log.info(`Searched the global ban list for ${inputs.steamId} - found ${filledBans.length} entries`);

      return exits.success(filledBans);
    })





  }


};
