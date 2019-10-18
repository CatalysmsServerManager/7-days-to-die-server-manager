module.exports = {
  friendlyName: "Set role",

  description: "Set a players role in CSMM",

  inputs: {
    playerSteamId: {
      type: "string",
      required: true
    },

    roleToSet: {
      type: "string",
      required: true
    },
    
    server: {
      type: "ref",
      required: true
    }
  },

  exits: {
    success: {
      outputFriendlyName: "Success",
      outputType: "boolean"
    }
  },

  fn: async function(inputs, exits) {
    const player = await Player.findOne({
      where: {
        steamId: inputs.playerSteamId,
        server: inputs.server.id
      }
    });

    if (_.isUndefined(player)) {
      return exits.error(`Unknown player`);
    }

    const role = await Role.findOne({
      where: {
        server: inputs.server.id,
        name: inputs.roleToSet
      }
    });

    await Player.update(
      { id: player.id },
      { role: role.id }
    );

    return exits.success();
  }
};
