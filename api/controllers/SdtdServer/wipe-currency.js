module.exports = {

  friendlyName: 'Wipe currency',

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

    let server = await SdtdServer.findOne(inputs.serverId);

    await Player.update({ id: playersToDestroy.map(_ => _.id) }, { currency: 0 });

    sails.log.info(`Set currency of ${playersToDestroy.length} player(s) from server ${server.name} to 0`, {server});

    return exits.success(playersToDestroy);
  }
};
