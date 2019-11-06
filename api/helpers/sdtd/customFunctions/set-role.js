module.exports = {
  friendlyName: "Set role",

  description: "Set a players role in CSMM",

  inputs: {
    playerId: {
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
    let idAsInt = parseInt(inputs.playerId);

    if (isNaN(idAsInt)) {
      idAsInt = 0;
    }

    let player = await Player.find({
      or: [
        { id: idAsInt },
        { steamId: inputs.playerId, server: inputs.serverId },
        { name: inputs.playerId, server: inputs.serverId }
      ]
    });

    player = player[0];

    if (_.isUndefined(player)) {
      return exits.error(new Error(`Unknown player`));
    }

    const role = await Role.findOne({
      where: {
        server: inputs.server.id,
        name: inputs.roleToSet
      }
    });

    await Player.update({ id: player.id }, { role: role.id });

    return exits.success();
  }
};
