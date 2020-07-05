module.exports = {


  friendlyName: 'Delete role',


  description: '',


  inputs: {

    roleId: {
      required: true,
      type: 'number',
      custom: async (valueToCheck) => {
        let foundRole = await Role.findOne(valueToCheck);
        return foundRole;
      },
    }


  },


  exits: {

  },


  fn: async function (inputs, exits) {

    let deletedRole = await Role.destroy({
      id: inputs.roleId
    }).fetch();

    sails.log.info(`Deleted a role ${deletedRole[0].name} for server ${deletedRole[0].server}`);

    return exits.success(deletedRole[0]);

  }


};
