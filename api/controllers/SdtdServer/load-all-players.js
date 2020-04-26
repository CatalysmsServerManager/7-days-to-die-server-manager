module.exports = {

  friendlyName: 'Load all players',

  description: 'Loads data about all players associated with a server',

  inputs: {
    server: {
      type: 'ref',
      required: true
    }

  },

  exits: {},

  fn: async function (inputs, exits) {
     try {
      let players = await sails.helpers.sdtd.loadAllPlayerData(inputs.server);
      return exits.success(players);

    } catch (error) {
      return exits.error(error)
    }

  }


};
