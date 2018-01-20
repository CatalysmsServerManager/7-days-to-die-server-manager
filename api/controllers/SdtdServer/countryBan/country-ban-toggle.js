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
        description: "Returns true if set to enabled, false if set to disabled"
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
        let server = await SdtdServer.findOne({
          id: inputs.serverId
        });
        if (_.isUndefined(server)) {
          return exits.notFound()
        }

        let countryBanStatus = sails.hooks.countryban.getStatus(inputs.serverId)

        if (_.isUndefined(countryBanStatus)) {
          await sails.hooks.countryban.start(inputs.serverId);
        } else {
          await sails.hooks.countryban.stop(inputs.serverId)
        }
        let status = await sails.hooks.countryban.getStatus(inputs.serverId)

        sails.log.debug(`API - SdtdServer:country-ban-toggle - New status for server ${inputs.serverId} is ${status}`);

        return exits.success(status)
      } catch (error) {
        sails.log.error(`API - SdtdServer:country-ban-toggle - ${error}`);
        return exits.error(error)
      }
  
  
    }
  
  
  };
  