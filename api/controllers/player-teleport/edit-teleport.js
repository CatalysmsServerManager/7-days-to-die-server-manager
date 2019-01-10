module.exports = {

  friendlyName: 'Delete a teleport',

  description: '',

  inputs: {
    id: {
      type: 'string',
      required: true
    },

    name: {
      type: 'string',
      maxLength: 50,
      minLength: 2
    },

    x: {
      type: 'number'
    },

    y: {
      type: 'number'
    },

    z: {
      type: 'number'
    },

    publicEnabled: {
      type: 'boolean'
    }

  },

  exits: {
    success: {},
  },


  fn: async function (inputs, exits) {

    let updatedTeleport = await PlayerTeleport.update({id: inputs.id}, inputs).fetch();
    return exits.success(updatedTeleport);

  }
};
