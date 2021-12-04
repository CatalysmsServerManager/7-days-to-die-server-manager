module.exports = {

  friendlyName: 'Give item',

  description: 'Give item(s) to a player from the server',

  inputs: {
    playerId: {
      description: 'The ID of the player',
      type: 'number',
      required: true
    },

    itemName: {
      type: 'string',
      required: true
    },

    amount: {
      type: 'number',
      required: true
    },

    quality: {
      type: 'number',
      min: 0,
      max: 500
    }
  },

  exits: {
    success: {},
    notFound: {
      responseType: 'notFound'
    },

    badRequest: {
      description: 'The given item name was not found on the server',
      responseType: 'badRequest',
      statusCode: 400
    }
  },

  /**
   * @memberof Player
   * @method give-item
   * @description Give items to a player
   * @param {string} playerId  Id of the player
   */

  fn: async function (inputs, exits) {

    try {

      let player = await Player.findOne(inputs.playerId).populate('server');
      let server = await SdtdServer.findOne(player.server.id);
      inputs.itemName = inputs.itemName.replace(/"/g, '');
      const cpmVersion = await sails.helpers.sdtd.checkCpmVersion(server.id);

      let validItemName = await sails.helpers.sdtd.validateItemName(player.server.id, inputs.itemName);

      if (!validItemName) {
        return exits.badRequest('You have provided an invalid item name.');
      }

      // TODO start - this should be a helper
      let cmdToExec;
      if (cpmVersion >= 6.4) {
        cmdToExec = `giveplus ${player.entityId} "${inputs.itemName}" ${inputs.amount} ${inputs.quality ? inputs.quality + ' 0' : ''}`;
      } else {
        cmdToExec = `give ${player.entityId} "${inputs.itemName}" ${inputs.amount} ${inputs.quality ? inputs.quality : ''}`;
      }

      let response = await sails.helpers.sdtdApi.executeConsoleCommand(SdtdServer.getAPIConfig(server), cmdToExec);

      if (response.result.startsWith('ERR:')) {
        return exits.badRequest(`Error while giving item - ${response.result}`);
      }
      // TODO end - this should be a helper

      await sails.helpers.sdtdApi.executeConsoleCommand(SdtdServer.getAPIConfig(server), `pm ${player.entityId} "CSMM - You have received ${inputs.amount} of ${inputs.itemName}"`);

      sails.log.info(`API - Player:give-item - giving ${inputs.amount} of ${inputs.itemName} to ${inputs.playerId} with quality: ${inputs.quality}`, {player, server});
      return exits.success();
    } catch (error) {
      sails.log.error(`API - Player:give-item - ${error}`, {playerId: inputs.playerId});
      return exits.error(error);
    }




  }
};
