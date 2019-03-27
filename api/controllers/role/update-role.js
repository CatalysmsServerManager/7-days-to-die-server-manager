module.exports = {


  friendlyName: 'Update role',


  description: '',


  inputs: {

    roleId: {
      required: true,
      type: 'number',
      custom: async (valueToCheck) => {
        let foundRole = await Role.findOne(valueToCheck);
        return foundRole;
      },
    },

    name: {
      type: 'string',
    },

    level: {
      type: 'number',
      min: 0,
      max: 9999,
    },

    isDefault: {
      type: 'boolean',
    },

    discordRole: {
      type: 'string'
    },

    amountOfTeleports: {
      type: 'number',
      min: 0,
    },

    economyDeductMultiplier: {
      type: 'number',
      min: 0
    },

    economyGiveMultiplier: {
      type: 'number',
      min: 0
    },

    manageServer: {
      type: 'boolean',
    },

    manageEconomy: {
      type: 'boolean',
    },

    useChat: {
      type: 'boolean',
    },

    useCommands: {
      type: 'boolean',
    },

    managePlayers: {
      type: 'boolean',
    },

    manageTickets: {
      type: 'boolean',
    },

    useTracking: {
      type: 'boolean',
    },

    viewAnalytics: {
      type: 'boolean',
    },

    viewDashboard: {
      type: 'boolean'
    },

    manageGbl: {
      type: 'boolean'
    },

    discordExec: {
      type: 'boolean',
    },

    discordLookup: {
      type: 'boolean',
    },

  },


  exits: {

  },


  fn: async function (inputs, exits) {

    const role = await Role.findOne(inputs.roleId).populate('server');
    const server = role.server;

    // If another role is currently set as default, we must set that one to false.
    // There can only be one default role per server.
    if (inputs.isDefault) {
      await Role.update({
        server: server.id,
        isDefault: true
      }, {
        isDefault: false,
      });
    }

    let updateObj = {
      name: inputs.name,
      level: inputs.level,
      amountOfTeleports: inputs.amountOfTeleports,
      economyDeductMultiplier: inputs.economyDeductMultiplier,
      economyGiveMultiplier: inputs.economyGiveMultiplier,
      discordRole: inputs.discordRole,
      manageServer: inputs.manageServer,
      manageEconomy: inputs.manageEconomy,
      useChat: inputs.useChat,
      useCommands: inputs.useCommands,
      managePlayers: inputs.managePlayers,
      viewDashboard: inputs.viewDashboard,
      useTracking: inputs.useTracking,
      viewAnalytics: inputs.viewAnalytics,
      manageTickets: inputs.manageTickets,
      manageGbl: inputs.manageGbl,
      discordExec: inputs.discordExec,
      discordLookup: inputs.discordLookup,
      isDefault: inputs.isDefault,
    };

    let updatedRole = await Role.update({
      id: inputs.roleId
    }, updateObj).fetch();

    sails.log.info(`Updated a role for server ${updatedRole[0].server}`, updatedRole[0])

    return exits.success(updatedRole[0]);

  }


};
