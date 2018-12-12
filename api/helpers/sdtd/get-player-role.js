module.exports = {


  friendlyName: 'Get player role',


  description: '',


  inputs: {

    playerId: {
      required: true,
      type: 'number',
      custom: async (valueToCheck) => {
        let foundPlayer = await Player.findOne(valueToCheck);
        return foundPlayer
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

    //sails.log.verbose(`Found role ${foundRole.name} for player ${player.name}`)
    return exits.success(foundRole);

  }


};
