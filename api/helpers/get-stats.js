module.exports = {


  friendlyName: 'Get stats',


  description: 'Returns data from a web request to 7 days to die server\'s /api/getstats',


  inputs: {

    id: {
      type: 'number',
      description: 'ID of the server to get stats from',
      required: true
    }
  },


  exits: {

    success: {
      outputFriendlyName: 'Stats',
      outputExample: {
        'gametime': {
          'days': 1,
          'hours': 7,
          'minutes': 27
        },
        'players': 0,
        'hostiles': 0,
        'animals': 0
      }
    }

  },


  fn: async function(inputs, exits) {
    var stats = await sails.helpers.webRequestToSdtdServer({
      id: inputs.id,
      apiModule: 'getstats'
    });

    // Send back the result through the success exit.
    return exits.success(stats);

  }


};
