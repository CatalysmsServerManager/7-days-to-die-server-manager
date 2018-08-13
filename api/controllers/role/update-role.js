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

  },


  exits: {

  },


  fn: async function (inputs, exits) {

    let updateObj = {
      name: inputs.name,
      level: inputs.level
    };

    let updatedRole = await Role.update({id: inputs.roleId}, updateObj).fetch();

    sails.log.info(`Updated a role for server ${updatedRole[0].server}`, updatedRole[0])

    return exits.success(updatedRole);

  }


};
