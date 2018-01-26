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
      description: "Returns true if set to enabled, false if set to disabled"
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
      sails.log.debug(`API - SdtdServer:commands-reload - Reloading config for server ${inputs.serverId}`);

      let server = await SdtdServer.findOne({
        id: inputs.serverId
      });
      let config = await SdtdConfig.findOne({
        server: server.id
      })

      if (_.isUndefined(server)) {
        return exits.notFound()
      }
      if (_.isUndefined(config)) {
        return exits.notFound()
      }
      if (_.isUndefined(inputs.newConfig.commandsEnabled) || _.isUndefined(inputs.newConfig.commandPrefix)) {
        sails.log.error(`API - SdtdServer:commands-reload - Invalid value for commandsEnabled ${inputs.newConfig.commandsEnabled} or commandPrefix ${inputs.newConfig.commandPrefix}`);
        return exits.badRequest(`Invalid value(s) for new config`)
      }

      sails.hooks.sdtdcommands.updateConfig(inputs.serverId, inputs.newConfig);

      sails.log.debug(`API - SdtdServer:commands-reload - Reloaded config for server ${inputs.serverId}`);

      return exits.success()
    } catch (error) {
      sails.log.error(`API - SdtdServer:commands-reload - ${error}`);
      return exits.error(error)
    }


  }


};
