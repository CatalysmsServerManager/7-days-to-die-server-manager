module.exports = {
  friendlyName: "Add Currency",

  description: "Adds some currency to a players balance",

  inputs: {
    playerId: {
      type: "string",
      required: true
    },

    currencyToAdd: {
      type: "number",
      required: true
    },

    serverId: {
      type: "string"
    }
  },

  exits: {
    success: {
      outputFriendlyName: "Success",
      outputType: "boolean"
    }
  },

  fn: async function(inputs, exits) {
    let player = await Player.find({
      or: [
        { id: parseInt(inputs.playerId) },
        { steamId: inputs.playerId, server: inputs.serverId }
      ]
    });

    player = player[0];

    if (_.isUndefined(player)) {
      return exits.error(new Error(`Unknown player`));
    }

    if (inputs.currencyToAdd > 0) {
      await sails.helpers.economy.giveToPlayer(
        player.id,
        inputs.currencyToAdd,
        "Function call from a custom command - add"
      );
    }

    if (inputs.currencyToAdd < 0) {
      await sails.helpers.economy.deductFromPlayer(
        player.id,
        Math.abs(inputs.currencyToAdd),
        "Function call from a custom command - deduct"
      );
    }

    return exits.success();
  }
};
