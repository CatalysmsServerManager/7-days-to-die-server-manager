module.exports = {

  friendlyName: 'Delete teleport',

  inputs: {
    id: {
      type: 'number',
      required: true
    },
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
    const teleport = await SavedTeleport.destroy({
      id: inputs.id,
      server: inputs.serverId
    }).fetch();

    return exits.success(teleport);
  }
};
