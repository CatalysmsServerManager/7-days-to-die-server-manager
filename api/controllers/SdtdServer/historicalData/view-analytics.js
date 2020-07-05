module.exports = {

  friendlyName: 'Get analytics view',


  inputs: {
    serverId: {
      required: true,
      example: 4
    }
  },


  exits: {
    success: {
      responseType: 'view',
      viewTemplatePath: 'sdtdServer/analytics'
    }

  },


  fn: async function (inputs, exits) {

    try {
      let server = await SdtdServer.findOne({
        id: inputs.serverId
      });

      sails.log.info(`VIEW - SdtdServer:analytics-view - serving analytics view for server ${server.name}`);
      exits.success({
        server: server
      });
    } catch (error) {
      sails.log.error(`VIEW - SdtdServer:analytics-view - ${error}`);
    }

  }


};
