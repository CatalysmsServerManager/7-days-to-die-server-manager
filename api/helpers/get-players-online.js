module.exports = {


  friendlyName: 'Get players online',

  description: '',


  inputs: {
    id: {
      type: 'number',
      description: 'ID of the server to get stats from',
      required: true
    }
  },


  exits: {

    success: {
      outputFriendlyName: 'Players online',
      outputExample: [{ 'steamid': '76561198049601888', 'entityid': 69358, 'ip': '94.192.187.95', 'name': 'GAD', 'online': true, 'position': { 'x': -2496, 'y': 119, 'z': -1006 }, 'experience': 0, 'level': 163.886657714844, 'health': 81, 'stamina': 90, 'zombiekills': 693, 'playerkills': 0, 'playerdeaths': 64, 'score': 373, 'totalplaytime': 333063, 'lastonline': '2017-11-02T20:11:41', 'ping': 27 },
        { 'steamid': '76561198148219049', 'entityid': 873641, 'ip': '88.108.232.126', 'name': 'Sownie', 'online': true, 'position': { 'x': -1758, 'y': 4, 'z': -9079 }, 'experience': 0, 'level': 158.514846801758, 'health': 218, 'stamina': 250, 'zombiekills': 120, 'playerkills': 0, 'playerdeaths': 30, 'score': 43, 'totalplaytime': 587930, 'lastonline': '2017-11-02T20:11:41', 'ping': 67 }
      ],
      outputType: 'json'
    }

  },


  fn: async function(inputs, exits) {

    // Get players online.
    var playersOnline = await sails.helpers.webRequestToSdtdServer({
      id: inputs.id,
      apiModule: 'getplayersonline'
    });

    // Send back the result through the success exit.
    return exits.success(playersOnline);

  }


};
