module.exports = {


  friendlyName: 'CountryBan toggle',


  description: 'Toggle the 7dtdCountryBanHook',


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
    success: {
      description: 'Returns true if set to enabled, false if set to disabled'
    }

  },

  /**
     * @memberof SdtdServer
     * @name country-ban-toggle
     * @method
     * @description Toggles the status of the country ban hook for a server
     * @param {string} serverId
     */


  fn: async function (inputs, exits) {

    try {
      sails.log.debug(`API - SdtdServer:country-ban-toggle - Toggling country ban for server ${inputs.serverId}`);
      const server = await SdtdServer.findOne({
        id: inputs.serverId
      }).populate('config');
      if (_.isUndefined(server)) {
        return exits.notFound();
      }

      let currentConfig = server.config[0].countryBanConfig;
      let countryBanStatus = sails.hooks.countryban.getStatus(inputs.serverId);

      if (_.isUndefined(countryBanStatus)) {
        currentConfig.enabled = true;
        await sails.hooks.countryban.start(inputs.serverId);
      } else {
        currentConfig.enabled = false;
        await sails.hooks.countryban.stop(inputs.serverId);
      }

      await SdtdConfig.update({
        server: inputs.serverId
      }, {
        countryBanConfig: currentConfig
      });
      let status = await sails.hooks.countryban.getStatus(inputs.serverId);

      sails.log.debug(`API - SdtdServer:country-ban-toggle - New status for server ${inputs.serverId} is ${status}`);

      return exits.success(status);
    } catch (error) {
      sails.log.error(`API - SdtdServer:country-ban-toggle - ${error}`);
      return exits.error(error);
    }


  }


};
