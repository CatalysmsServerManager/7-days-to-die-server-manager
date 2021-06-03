const validator = require('validator').default;

module.exports = {

  friendlyName: 'Add teleport',

  inputs: {
    serverId: {
      type: 'number',
      required: true
    },
    x: {
      type: 'number',
      required: true
    },
    y: {
      type: 'number',
      required: true
    },
    z: {
      type: 'number',
      required: true
    },
    name: {
      type: 'string',
      required: true,
      custom: value => validator.isAlphanumeric(value)
    }
  },

  exits: {
    success: {
    },
  },


  fn: async function (inputs, exits) {

    const teleport = await SavedTeleport.create({
      name: inputs.name,
      x: inputs.x,
      y: inputs.y,
      z: inputs.z,
      server: inputs.serverId
    }).fetch();

    return exits.success(teleport);
  }
};
