module.exports = {


  friendlyName: 'Serves a servers shop view',


  description: '',


  inputs: {
    serverId: {
      type: 'number',
      required: true
    }
  },


  exits: {

    success: {
      description: '',
      responseType: 'view',
      viewTemplatePath: 'sdtdServer/economy/shop'
    },

    notLoggedIn: {
      description: '',
      responseType: 'view',
      viewTemplatePath: 'sdtdServer/economy/shop-logout',
      statusCode: 400
    }

  },



  fn: async function (inputs, exits) {

    try {
      let server = await SdtdServer.findOne(inputs.serverId).populate('admins').populate('config');
      let listings = await ShopListing.find({ server: inputs.serverId });

      if (_.isUndefined(this.req.session.userId)) {
        return exits.notLoggedIn('You must be logged in to view a shop.');
      }

      if (!server.config[0].economyEnabled) {
        return exits.notLoggedIn('This server does not have economy enabled!');
      }

      let user = await User.findOne(this.req.session.userId).populate('players');
      let player = false;

      for (const playerToCheck of user.players) {
        if (playerToCheck.server === server.id) {
          player = playerToCheck;
        }
      }

      if (!player) {
        return exits.notLoggedIn({
          server: server,
        });
      }

      player.role = await sails.helpers.sdtd.getPlayerRole(player.id);

      let unclaimedItems = await PlayerClaimItem.find({ player: player.id, claimed: false });

      let isAdmin = false;

      let permCheck = await sails.helpers.roles.checkPermission.with({
        userId: user.id,
        serverId: server.id,
        permission: 'manageEconomy'
      });

      if (permCheck.hasPermission) {
        isAdmin = true;
      }

      server = _.omit(server, 'authName', 'authToken', 'webPort');

      return exits.success({
        server: server,
        listings: listings,
        player: player,
        user: user,
        isAdmin: isAdmin,
        unclaimedItems: unclaimedItems,
      });

    } catch (error) {
      sails.log.error(error);
      return exits.error(error);
    }


  }


};
