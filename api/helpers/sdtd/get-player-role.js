module.exports = {


  friendlyName: 'Get player role',


  description: '',


  inputs: {

    playerId: {
      required: true,
      type: 'number',
      custom: async (valueToCheck) => {
        let foundPlayer = await Player.findOne(valueToCheck);
        return foundPlayer;
      },
    },

  },


  exits: {
    success: {
      outputFriendlyName: 'Success',
      outputType: 'json'
    },

  },

  fn: async function (inputs, exits) {

    let player = await Player.findOne(inputs.playerId);

    let foundRole;

    if (player.role) {
      foundRole = await Role.findOne(player.role);
    } else {
      foundRole = undefined;
    }

    if (_.isUndefined(foundRole)) {
      foundRole = await sails.helpers.roles.getDefaultRole(player.server);
    }

    sails.log.debug(`Found role ${foundRole.name} for player ${player.name}`, {player, serverId: player.server});
    return exits.success(foundRole);

  }


};
