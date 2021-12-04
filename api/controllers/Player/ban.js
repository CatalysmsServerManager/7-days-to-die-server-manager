module.exports = {

  friendlyName: 'Ban player',

  description: 'Ban a player from the server',

  inputs: {
    playerId: {
      description: 'The ID of the player',
      type: 'number',
      required: true
    },
    reason: {
      description: 'Reason the player gets banned',
      type: 'string'
    },
    duration: {
      description: 'How long to ban the player for',
      type: 'number'
    },
    durationUnit: {
      description: 'Time unit to ban player', //["minutes", "hours", "days", "weeks", "months", "years"]
      type: 'string'
    }
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
   * @method ban
   * @description ban a player
   * @param {string} steamId  Steam ID of the player
   * @param {string} serverId  ID of the server
   */

  fn: async function (inputs, exits) {
    const player = await Player.findOne(inputs.playerId);
    const server = await SdtdServer.findOne(player.server);

    const response = await sails.helpers.sdtdApi.executeConsoleCommand(
      SdtdServer.getAPIConfig(server),
      `ban add ${player.entityId} ${inputs.duration} ${inputs.durationUnit.toLowerCase()} "${inputs.reason}"`
      );
      
    return exits.success(response);        
  }
};
