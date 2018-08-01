const request = require('request-promise-native');

module.exports = {


  friendlyName: 'Get reset regions',


  description: '',


  inputs: {
    serverId: {
      required: true,
      type: 'string'
    }
  },


  exits: {

    notFound: {
      description: 'Server with given ID not found in the system',
      responseType: 'notFound'
    },

  },

  fn: async function (inputs, exits) {

    let server = await SdtdServer.findOne(inputs.serverId);

    if (_.isUndefined(server)) {
      return exits.notFound();
    }

    let regionData
    try {
      regionData = await request.get(`http://${server.ip}:${server.webPort}/static/regionclaims.json`);
    } catch (error) {
        if (error.statusCode === 404) {
            return exits.notFound();
        }
      sails.log.error(`Error getting reset region data - ${error}`);
      return exits.error(new Error(error))
    }


    return exits.success(JSON.parse(regionData));

  }


};
