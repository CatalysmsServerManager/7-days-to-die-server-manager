module.exports = {


  friendlyName: 'Add player',


  description: '',


  inputs: {

    roleId: {
      type: 'number',
      required: true,
      custom: async (valueToCheck) => {
        let foundRole = await Role.findOne(valueToCheck);
        return foundRole;
      },
    },

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
    forbidden: {
      description: 'User is not allowed to do this action',
      responseType: 'forbidden',
      statusCode: 403
    },
  },


  fn: async function (inputs, exits) {

    const player = await Player.findOne(inputs.playerId).populate('server');
    const targetPlayerRole = await sails.helpers.sdtd.getPlayerRole(player.id);
    const userRole = await sails.helpers.roles.getUserRole(this.req.session.user.id, player.server.id);

    let role = await Role.findOne(inputs.roleId);

    if (userRole.level >= role.level) {
      return this.res.status(403).json({error: `You can only set a players role to a role lower than your own.`});
    }

    if (userRole.level >= targetPlayerRole.level) {
      return this.res.status(403).json({error: `You cannot change the role of someone with a higher or equal role.`});
    }

    let updatedPlayer = await Player.update({ id: inputs.playerId }, { role: role.id }).fetch();

    sails.log.info(`Updated a players role on server ${updatedPlayer[0].server} for player ${updatedPlayer[0].id} - ${updatedPlayer[0].name} to ${role.name}`,
      {player: updatedPlayer[0]});

    return exits.success(updatedPlayer);

  }


};
