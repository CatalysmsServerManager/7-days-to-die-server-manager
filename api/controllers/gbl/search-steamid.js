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

  },


  fn: async function (inputs, exits) {

    let foundBans = await BanEntry.find({
      steamId: inputs.steamId
    }).populate('server').populate('comments');

    // loads comment user info
    foundBans = foundBans.map(async ban => {

      ban.comments = ban.comments.map(async comment => {
        let foundUser = await User.findOne(comment.user);
        comment.user = foundUser
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
