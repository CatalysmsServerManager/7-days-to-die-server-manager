module.exports = {


  friendlyName: 'Add player',


  description: '',


  inputs: {

    roleId: {
      type: 'number',
      required: true,
      custom: async (valueToCheck) => {
        let foundRole = await Role.findOne(valueToCheck);
        return foundRole
      },
    },

    playerId: {
      type: 'number',
      required: true,
      custom: async (valueToCheck) => {
        let foundPlayer = await Player.findOne(valueToCheck);
        return foundPlayer
      },
    },

  },


  exits: {

  },


  fn: async function (inputs, exits) {

    let role = await Role.findOne(inputs.roleId);
    let updatedPlayer = await Player.update({id: inputs.playerId}, {role: role.id}).fetch();

    sails.log.info(`Updated a players role on server ${updatedPlayer[0].server} for player ${updatedPlayer[0].id} - ${updatedPlayer[0].name} to ${role.name}`);

    return exits.success(updatedPlayer);

  }


};
