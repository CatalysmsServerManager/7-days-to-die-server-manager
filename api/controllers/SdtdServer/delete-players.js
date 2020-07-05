module.exports = {

  friendlyName: 'Delete players',

  description: '',

  inputs: {
    serverId: {
      description: 'The ID of the server',
      type: 'number',
      required: true
    },
  },

  exits: {

    badInput: {
      responseType: 'badRequest'
    }
  },

  fn: async function (inputs, exits) {

    let playersToDestroy = await Player.find({
      server: inputs.serverId
    });

    let server = await SdtdServer.findOne(playersToDestroy[0].server);

    let playersToDestroyIds = playersToDestroy.map(player => player.id);

    await PlayerClaimItem.destroy({
      player: playersToDestroyIds
    });

    await PlayerTeleport.destroy({
      player: playersToDestroyIds
    });

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
