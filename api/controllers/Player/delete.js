module.exports = {

  friendlyName: 'Delete player(s)',

  description: '',

  inputs: {
    playerId: {
      description: 'The ID of the player',
      type: 'number',
    },
    serverId: {
      description: 'Id of a server',
      type: 'string'
    }
  },

  exits: {

    badInput: {
      responseType: 'badRequest'
    }
  },

  fn: async function (inputs, exits) {

    if (_.isUndefined(inputs.playerId) && _.isUndefined(inputs.serverId)) {
      return exits.badInput('You must provide a player ID OR a server ID');
    }

    let playersToDestroy = await Player.find({
      server: inputs.serverId,
      id: inputs.playerId
    });

    let server = await SdtdServer.findOne(playersToDestroy[0].server);

    let playersToDestroyIds = playersToDestroy.map(player => player.id);

    await PlayerClaimItem.destroy({
      player: playersToDestroyIds
    })

    await PlayerTeleport.destroy({
      player: playersToDestroyIds
    })

    await PlayerUsedCommand.destroy({
      player: playersToDestroyIds
    });


    await Player.destroy({
      id: playersToDestroyIds
    });

    sails.log.info(`Deleted ${playersToDestroy.length} player(s) from server ${server.name}`);

    return exits.success(playersToDestroy);
  }
};
