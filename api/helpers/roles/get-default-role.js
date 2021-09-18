module.exports = {


  friendlyName: 'Check permission',


  description: '',


  inputs: {

    serverId: {
      type: 'number',
      required: true
    },

  },


  exits: {

    invalidInput: {
      description: 'Invalid input given to this helper.'
    }

  },


  fn: async function (inputs, exits) {

    let roles = await Role.find({
      server: inputs.serverId
    });
    // Check if server has a role set as default
    let defaultRole = roles.filter(role => role.isDefault)[0];
    if (defaultRole) {
      return exits.success(defaultRole);
    }

    // If we find no default role for a server, we default to highest level role.
    let foundRole = await Role.find({
      where: {
        server: inputs.serverId
      },
      sort: 'level DESC',
      limit: 1
    });

    // If we still can't find a role, it's likely because the server has none configured. In this case we will create a default role.
    if (!foundRole[0]) {
      let amountOfRoles = await Role.count({
        server: inputs.serverId
      });

      sails.log.warn(`Detected ${amountOfRoles} roles for server ${inputs.serverId}. Creating a default one`, {serverId: inputs.serverId});
      if (amountOfRoles === 0) {
        let createdRole = await Role.create({
          server: inputs.serverId,
          name: 'Player',
          level: '2000',
        }).fetch();
        return exits.success(createdRole);
      }
    }

    return exits.success(foundRole[0]);

  }
};
