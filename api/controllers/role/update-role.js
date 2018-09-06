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
      min: 0
    },

    discordRole: {
      type: 'string'
    },

    amountOfTeleports: {
      type: 'number',
      min: 0,
    },

    manageServer: {
      type: 'boolean'
    },

    manageEconomy: {
      type: 'boolean'
    },

    useChat: {
      type: 'boolean'
    },

    useCommands: {
      type: 'boolean'
    },

    managePlayers: {
      type: 'boolean'
    },

    manageTickets: {
      type: 'boolean'
    },

    useTracking: {
      type: 'boolean'
    },

    viewAnalytics: {
      type: 'boolean'
    },

    viewDashboard: {
      type: 'boolean'
    }

  },


  exits: {

  },


  fn: async function (inputs, exits) {

    let updateObj = {
      name: inputs.name,
      level: inputs.level,
      amountOfTeleports: inputs.amountOfTeleports,
      discordRole: inputs.discordRole,
      manageServer: inputs.manageServer,
      manageEconomy: inputs.manageEconomy,
      useChat: inputs.useChat,
      useCommands: inputs.useCommands,
      managePlayers: inputs.managePlayers,
      viewDashboard: inputs.viewDashboard,
      useTracking: inputs.useTracking,
      viewAnalytics: inputs.viewAnalytics,
      manageTickets: inputs.manageTickets
    };

    let updatedRole = await Role.update({
      id: inputs.roleId
    }, updateObj).fetch();

    sails.log.info(`Updated a role for server ${updatedRole[0].server}`, updatedRole[0])

    return exits.success(updatedRole);

  }


};
