module.exports = {


  friendlyName: 'MOTD toggle',


  description: 'Toggle the 7dtdMOTDHook',


  inputs: {
    serverId: {
      required: true,
      type: 'string'
    },
    message: {
      type: 'string',
    },
    interval: {
      type: 'number'
    }
  },


  exits: {

    notFound: {
      description: 'Server with given ID not found in the system',
      responseType: 'notFound'
    },
    success: {
      description: 'Returns true if set to enabled, false if set to disabled'
    }

  },

  /**
   * @memberof SdtdServer
   * @name motd-toggle
   * @method
   * @description Toggles the status of the motd hook for a server
   * @param {string} serverId
   * @param {string} message
   * @param {number} interval
   */


  fn: async function (inputs, exits) {

    try {
      sails.log.debug(`API - SdtdServer:motd-toggle - Toggling motd for server ${inputs.serverId}`);
      let server = await SdtdServer.findOne({
        id: inputs.serverId
      });
      let config = await SdtdConfig.findOne({
        server: inputs.serverId
      });

      if (_.isUndefined(server) || _.isUndefined(config)) {
        return exits.notFound();
      }

      if (config.motdEnabled) {
        await sails.hooks.sdtdmotd.updateConfig(inputs.serverId, config.motdMessage, config.motdInterval, false, config.motdOnJoinEnabled);
      } else {
        await sails.hooks.sdtdmotd.updateConfig(inputs.serverId, config.motdMessage, config.motdInterval, true, config.motdOnJoinEnabled);
      }

      let status = sails.hooks.sdtdmotd.getStatus(inputs.serverId);
      sails.log.debug(`API - SdtdServer:motd-toggle - New status for server ${inputs.serverId} is ${status}`);

      return exits.success(status);
    } catch (error) {
      sails.log.error(`API - SdtdServer:motd-toggle - ${error}`);
      return exits.error(error);
    }


  }


};
