module.exports = {


  friendlyName: 'Get player inventory',

  description: '',


  inputs: {
    serverID: {
      type: 'number',
      description: 'ID of the server to get stats from',
      required: true
    },
    playerID: {
      type: 'number',
      description: 'steam ID of the player to get stats from',
      required: true
    }
  },


  exits: {

    success: {
      outputFriendlyName: 'Player inventory',
      outputExample: { 'playername': 'GAD', 'bag': [{ 'count': 6000, 'name': 'wood', 'icon': 'wood', 'iconcolor': 'FFFFFF', 'quality': -1 }, { 'count': 1000, 'name': 'concreteMix', 'icon': 'concreteMix', 'iconcolor': 'FFFFFF', 'quality': -1 }, { 'count': 479, 'name': 'emptyJar', 'icon': 'emptyJar', 'iconcolor': 'FFFFFF', 'quality': -1 }, { 'count': 211, 'name': 'forgedSteel', 'icon': 'forgedSteel', 'iconcolor': 'FFFFFF', 'quality': -1 }, { 'count': 6000, 'name': 'scrapIron', 'icon': 'scrapIron', 'iconcolor': 'FFFFFF', 'quality': -1 }, { 'count': 72, 'name': 'cement', 'icon': 'cement', 'iconcolor': 'FFFFFF', 'quality': -1 }, { 'count': 784, 'name': 'crushedSand', 'icon': 'crushedSand', 'iconcolor': 'FFFFFF', 'quality': -1 }, { 'count': 108, 'name': 'gunPowder', 'icon': 'gunPowder', 'iconcolor': 'FFFFFF', 'quality': -1 }, { 'count': 5, 'name': 'grainAlcohol', 'icon': 'grainAlcohol', 'iconcolor': 'FFFFFF', 'quality': -1 }, { 'count': 93, 'name': 'cornBread', 'icon': 'cornBread', 'iconcolor': 'FFFFFF', 'quality': -1 }] },
      outputType: 'json'
    }

  },


  fn: async function(inputs, exits) {

    // Get player inventory.
    var playerInventory = await sails.helpers.webRequestToSdtdServer({
      id: inputs.serverID,
      apiModule: 'getstats',
      extraqs: {
        steamid: inputs.playerID
      }
    });

    // Send back the result through the success exit.
    return exits.success(playerInventory);

  }


};
