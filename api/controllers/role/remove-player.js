module.exports = {


  friendlyName: 'Remove player',


  description: '',



  inputs: {

    playerId: {
      type: 'number',
      required: true,
      custom: async (valueToCheck) => {
        let foundPlayer = await Player.findOne(valueToCheck);
        return foundPlayer;
      },
    },

  },


  exits: {

  },


  fn: async function (inputs, exits) {
    const player = await Player.findOne(inputs.playerId).populate('server');
    const targetPlayerRole = await sails.helpers.sdtd.getPlayerRole(player.id);
    const userRole = await sails.helpers.roles.getUserRole(this.req.session.user.id, player.server.id);

    // "manageServer" is a special override. We should take it into account when checking player levels
    const canManageServer = await sails.helpers.roles.checkPermission.with({
      permission: 'manageServer',
      serverId: player.server.id,
      userId: this.req.session.user.id
    });

    if (userRole.level >= targetPlayerRole.level && !canManageServer.hasPermission) {
      return this.res.status(403).json({error: `You cannot change the role of someone with a higher or equal role.`});
    }

    let updatedPlayer = await Player.update({id: inputs.playerId}, {role: null}).fetch();

    sails.log.debug(`Removed a players role on server ${updatedPlayer[0].server} for player ${updatedPlayer[0].id} - ${updatedPlayer[0].name}`,
      {
        player: updatedPlayer[0],
        server: updatedPlayer[0].server,
      });

    return exits.success(updatedPlayer);

  }


};
