module.exports = {


  friendlyName: 'Commands reload',


  description: 'Reload server config sdtdCommandsHook',


  inputs: {
    serverId: {
      required: true,
      type: 'string'
    },
    newConfig: {
      type: 'json',
      required: true
    }
  },


  exits: {

    notFound: {
      description: 'Server with given ID not found in the system',
      responseType: 'notFound'
    },
    success: {
      description: 'Returns true if set to enabled, false if set to disabled'
    },
    badRequest: {
      responseType: 'badRequest'
    }

  },

  /**
   * @memberof SdtdServer
   * @name commands-reload
   * @method
   * @description Reloads the config of the country ban hook for a server
   * @param {string} serverId
   * @param {json} newConfig
   */


  fn: async function (inputs, exits) {

    try {
      sails.hooks.sdtdcommands.reload(inputs.serverId);
      sails.log.debug(`API - SdtdServer:commands-reload - Reloaded config for server ${inputs.serverId}`);
      return exits.success();
    } catch (error) {
      sails.log.error(`API - SdtdServer:commands-reload - ${error}`);
      return exits.error(error);
    }


  }


};
