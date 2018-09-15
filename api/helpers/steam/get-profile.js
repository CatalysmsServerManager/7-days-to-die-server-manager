const rp = require('request-promise-native');

module.exports = {


  friendlyName: 'Get profile',


  description: '',


  inputs: {

    steamId: {
      type: 'string',
      required: true
    }

  },


  exits: {

    success: {
      outputFriendlyName: 'Profile',
      outputType: 'ref'
    },

    /*     {
          "response": {
            "players": [{
              "steamid": "76561198028175941",
              "communityvisibilitystate": 3,
              "profilestate": 1,
              "personaname": "Cata",
              "lastlogoff": 1536789081,
              "commentpermission": 1,
              "profileurl": "https://steamcommunity.com/profiles/76561198028175941/",
              "avatar": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/6a/6a6ab88e6b62fd869b6cb724e267d4ad71121653.jpg",
              "avatarmedium": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/6a/6a6ab88e6b62fd869b6cb724e267d4ad71121653_medium.jpg",
              "avatarfull": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/6a/6a6ab88e6b62fd869b6cb724e267d4ad71121653_full.jpg",
              "personastate": 0,
              "primaryclanid": "103582791434187790",
              "timecreated": 1280140518,
              "personastateflags": 0,
              "loccountrycode": "BE",
              "locstatecode": "09"
            }]
          }
        } */

  },


  fn: async function (inputs, exits) {

    let requestOptions = {
      uri: 'https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/',
      qs: {
        key: process.env.API_KEY_STEAM,
        steamids: inputs.steamId
      },
      json: true
    }

    rp(requestOptions)
      .then(function (data) {
        return exits.success(data.response.players)
      })
      .catch(function (err) {
        return exits.error(err)
      });

  }


};
