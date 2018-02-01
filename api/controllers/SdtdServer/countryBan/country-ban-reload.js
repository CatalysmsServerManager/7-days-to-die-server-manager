module.exports = {


  friendlyName: 'CountryBan reload',


  description: 'Reload server config 7dtdCountryBanHook',


  inputs: {
    serverId: {
      required: true,
      type: 'string'
    },
    newConfig: {
      type: 'json'
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
   * @name country-ban-reload
   * @method
   * @description Reloads the config of the country ban hook for a server
   * @param {string} serverId
   */


  fn: async function (inputs, exits) {

    try {
      sails.log.debug(`API - SdtdServer:country-ban-reload - Reloading config for server ${inputs.serverId}`);
      let server = await SdtdServer.findOne({
        id: inputs.serverId
      });

      if (_.isUndefined(server)) {
        return exits.notFound();
      }

      let config = await SdtdConfig.findOne({server: server.id});

      if (_.isUndefined(inputs.newConfig)) {
        sails.hooks.countryban.reload(inputs.serverId);
      } else {
        let configToSend = config.countryBanConfig;

        if (typeof inputs.newConfig.bannedCountries === typeof new Array()) {
          // Handle the input countries & adjust the config to send accordingly
          for (const country of inputs.newConfig.bannedCountries) {
            if (configToSend.bannedCountries.includes(country)) {
              var index = configToSend.bannedCountries.indexOf(country);
              if (index > -1) {
                configToSend.bannedCountries.splice(index, 1);
              }
            } else {
              configToSend.bannedCountries.push(country);
            }
          }
        }


        configToSend.kickMessage = inputs.newConfig.kickMessage == '' ? configToSend.kickMessage : inputs.newConfig.kickMessage;

        sails.hooks.countryban.reload(inputs.serverId, configToSend);
      }

      sails.log.debug(`API - SdtdServer:country-ban-reload - Reloaded config for server ${inputs.serverId}`);

      return exits.success();
    } catch (error) {
      sails.log.error(`API - SdtdServer:country-ban-reload - ${error}`);
      return exits.error(error);
    }


  }


};
