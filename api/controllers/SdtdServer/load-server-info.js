module.exports = {


  friendlyName: 'Load server info',


  description: 'Load server info and save to database',


  inputs: {
    serverId: {
      required: true,
      description: 'ID of the server',
      type: 'string'
    }
  },


  exits: {
    notFound: {
      description: 'Given serverId did not correspond to a server in the system'
    }
  },

  /**
   * @memberof SdtdServer
   * @method
   * @name load-server-info
   * @description Load/update server info and save to DB
   * @param {number} serverId ID of the server
   */


  fn: async function (inputs, exits) {

    sails.log.debug(`API - SdtdServer:loadServerInfo - loading info for server ${inputs.serverId}`, {serverId: inputs.serverId});

    try {
      let serverInfo = await sails.helpers.loadSdtdserverInfo(inputs.serverId);
      exits.success(serverInfo);
    } catch (error) {
      sails.log.error(`API - SdtdServer:loadServerInfo - ${error}`, {serverId: inputs.serverId});
    }
  }


};
