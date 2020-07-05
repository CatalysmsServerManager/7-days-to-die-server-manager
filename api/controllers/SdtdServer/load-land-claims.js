const request = require('request-promise-native');

module.exports = {


  friendlyName: 'Load land claims',


  description: '',


  inputs: {

    serverId: {
      type: 'number',
      required: true,
      custom: async (valueToCheck) => {
        let foundServer = await SdtdServer.findOne(valueToCheck);
        return foundServer;
      },
    },

    playerId: {
      type: 'number',
      custom: async (valueToCheck) => {
        let foundPlayer = await Player.findOne(valueToCheck);
        return foundPlayer;
      },
    },

  },


  exits: {
  },


  fn: async function (inputs, exits) {

    let server = await SdtdServer.findOne(inputs.serverId);

    let reqOpts = {
      uri: `http://${server.ip}:${server.webPort}/api/getlandclaims`,
      qs: {
        adminuser: server.authName,
        admintoken: server.authToken,
      }
    };

    if (inputs.playerId) {
      let player = await Player.findOne(inputs.playerId);
      reqOpts.qs.steamid = player.steamId;
    }

    request(reqOpts)
      .then(data => {
        console.log(data);
        return exits.success(JSON.parse(data));
      })
      .catch(err => {
        return exits.error(err);
      });

  }


};
