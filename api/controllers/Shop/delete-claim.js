module.exports = {


  friendlyName: 'Delete claimed item',


  description: '',


  inputs: {
    serverId: {
      type: 'number',
      required: true
    },

    claimId: {
      type: 'number',
      required: true,
    },
  },


  exits: {
    success: {},

    invalidIds: {
      description: '',
      responseType: 'badRequest',
      statusCode: 400
    }
  },


  fn: async function (inputs, exits) {
    const toDelete = await PlayerClaimItem.findOne({ id: inputs.claimId });

    await PlayerClaimItem.destroy({ id: inputs.claimId });

    await HistoricalInfo.create({
      type: 'economy',
      economyAction: 'deleteClaim',
      server: inputs.serverId,
      player: toDelete.player,
      message: `Deleted claimed item ${toDelete.amount}x ${toDelete.name} from player ${toDelete.playerName}`
    });

    return exits.success();

  }


};
