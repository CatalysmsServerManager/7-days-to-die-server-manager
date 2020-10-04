const request = require('request');
const sevenDaysAPI = require('7daystodie-api-wrapper');


module.exports = {

  friendlyName: 'Get mod version',

  description: '',

  inputs: {

    serverId: {
      description: 'Id of the SdtdServer',
      type: 'string',
      required: true
    },
    z: {
      type: 'number',
      required: true
    },
    y: {
      type: 'number',
      required: true
    },
    x: {
      type: 'number',
      required: true
    },
  },

  exits: {
    success: {},
    notFound: {
      description: 'No server with the specified ID was found in the database.',
      responseType: 'notFound'
    },
    unknownError: {
      responseType: 'badRequest'
    },
  },

  fn: async function (inputs, exits) {
    const server = await SdtdServer.findOne(inputs.serverId).populate('config');
    // is there a cheap way to call api/helpers/user/get-servers-with-permission.js

    if (!server) {
      return exits.notFound();
    }

    const baseUrl = sevenDaysAPI.getBaseUrl(SdtdServer.getAPIConfig(server));
    const url = `${baseUrl}/map/${inputs.z}/${inputs.x}/${inputs.y}.png?adminuser=${server.authName}&admintoken=${server.authToken}`;
    if (!server.config[0].mapProxy) {
      this.res.redirect(url);
      return;
    }

    const reqHeaders = {...this.req.headers};
    delete reqHeaders.host;
    delete reqHeaders.connection;
    delete reqHeaders['upgrade-insecure-requests'];

    try {
      request({ url: url, headers: reqHeaders }).pipe(this.res);
    } catch (error) {
      sails.log.error(`Error getting server-tile for ${url}`, error);

      return exits.unknownError();
    }
  }
};
