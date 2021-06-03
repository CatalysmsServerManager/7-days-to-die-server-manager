module.exports = {

  friendlyName: 'Get teleport',

  inputs: {
    serverId: {
      type: 'number',
      required: true
    },
  },

  exits: {
    success: {
    },
  },


  fn: async function (inputs, exits) {
    const teleports = await SavedTeleport.find({
      server: inputs.serverId
    });

    return exits.success(teleports);
  }
};
