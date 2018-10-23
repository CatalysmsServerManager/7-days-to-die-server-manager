const rp = require('request-promise-native');

module.exports = {


  friendlyName: 'Vote for Server',


  description: 'Cast a vote directly from the Game Chat Box.',


  inputs: {

    steamId: {
      type: 'string',
      required: true
    },

    serverKey: {
      type: 'string',
      required: true
    },

    playerUsername: {
      type: 'string',
      required: true
    },

    actionType: {
      type: 'string',
      required: true
    }

  },


  exits: {

    success: {
      outputFriendlyName: 'Success',
    },

  },


  fn: async function (inputs, exits) {
    let requestOptions = {
      uri: 'https://7daystodie-servers.com/api/',
      qs: {
        action: inputs.actionType,
        object: 'votes',
        element: 'claim',
        key: inputs.serverKey,
        steamid: inputs.steamId,
        username: inputs.playerUsername
      },
      json: true
    }

    rp(requestOptions)
      .then(function (data) {
        return exits.success(data);
      })
      .catch(function (err) {
        return exits.error(err)
      });

  }


};
