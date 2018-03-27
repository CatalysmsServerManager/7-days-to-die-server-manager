module.exports = {

  friendlyName: 'Get teleports',

  description: 'Get teleport locations configured by a player',

  inputs: {
    playerId: {
      description: 'The ID of the player',
      type: 'number',
      required: true
    },
  },

  exits: {
    success: {},
    notFound: {
      description: 'No player with the specified ID was found in the database.',
      responseType: 'notFound'
    }
  },

  /**
   * @memberof Player
   * @method get-teleports
   * @description Get configured teleport locations of a player
   * @param {string} playerId  ID of the player
   */

  fn: async function (inputs, exits) {

    let foundTeleports = await PlayerTeleport.find({player: inputs.playerId});
    return exits.success(foundTeleports);

  }
};
