module.exports = {


  friendlyName: 'Update role',


  description: '',


  inputs: {

    roleId: {
      required: true,
      type: 'number',
      custom: async (valueToCheck) => {
        let foundRole = await Role.findOne(valueToCheck);
        return foundRole
      },
    },

    name: {
      type: 'string',
    },

    level: {
      type: 'number',
    },

    discordRole: {
      type: 'string'
    },

    amountOfTeleports: {
      type: 'number',
      min: 0,
    },

  },


  exits: {

  },


  fn: async function (inputs, exits) {

    let updateObj = {
      name: inputs.name,
      level: inputs.level,
      amountOfTeleports: inputs.amountOfTeleports,
      discordRole: inputs.discordRole
    };

    let updatedRole = await Role.update({id: inputs.roleId}, updateObj).fetch();

    sails.log.info(`Updated a role for server ${updatedRole[0].server}`, updatedRole[0])

    return exits.success(updatedRole);

  }


};
