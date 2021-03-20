module.exports = {


  friendlyName: 'Load player stats',


  description: 'Loads zombie/players kills, level and score & saves to DB',


  inputs: {

    serverId: {
      type: 'number',
      required: true
    },
    steamId: {
      type: 'string',
      minLength: 1
    }

  },

  exits: {
    success: {
      outputFriendlyName: 'Success',
    }
  },

  fn: async function (inputs, exits) {
    const sdtdServer = await SdtdServer.findOne({ id: inputs.serverId });

    const playersResponse = await sails.helpers.sdtdApi.getOnlinePlayers(SdtdServer.getAPIConfig(sdtdServer));


    const promises = [];
    for (const player of playersResponse) {
      if (!player.steamid) {
        continue;
      }
      const updateObj = {
        deaths: player.playerdeaths,
        score: player.score,
        level: Math.floor(player.level),
        positionX: player.position.x,
        positionY: player.position.y,
        positionZ: player.position.z,

      };
      promises.push(Player.update({ server: inputs.serverId, steamId: player.steamid }, updateObj).fetch());
    }

    const players = (await Promise.all(promises)).filter(_ => _.length).map(_ => _[0]);

    if (inputs.steamId) {
      const player = players.filter(_ => _.steamId === inputs.steamId)[0];
      return exits.success(player);
    }

    return exits.success(players);
  }
};
