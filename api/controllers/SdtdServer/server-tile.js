const request = require('request');

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
    const server = await SdtdServer.findOne(inputs.serverId);

    if (!server) {
      return exits.notFound();
    }

    const baseUrl = sails.helpers.sdtdApi.getBaseUrl(SdtdServer.getAPIConfig(server));
    const url = `${baseUrl}/map/${inputs.z}/${inputs.x}/${inputs.y}.png?adminuser=${server.authName}&admintoken=${server.authToken}`;

    const reqHeaders = {
      ...this.req.headers,
      ['X-SDTD-API-TOKENNAME']: server.authName,
      ['X-SDTD-API-SECRET']: server.authToken,
    };
    delete reqHeaders.host;
    delete reqHeaders.connection;
    delete reqHeaders['upgrade-insecure-requests'];


    request({ url: url, headers: reqHeaders })
      .on('error', function (err) {
        return exits.unknownError(err);
      }).pipe(this.res);
  }
};
