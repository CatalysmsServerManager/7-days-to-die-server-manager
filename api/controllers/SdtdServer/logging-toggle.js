module.exports = {


  friendlyName: 'Logging toggle',


  description: 'Toggle the 7dtdLoggingHook',


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
   * @name logging-toggle
   * @method
   * @description Toggles the status of the logging hook for a server
   * @param {string} serverId
   */


  fn: async function (inputs, exits) {

    try {
      sails.log.debug(`API - SdtdServer:logging-toggle - Toggling logging for server ${inputs.serverId}`);
      let server = await SdtdServer.findOne({
        id: inputs.serverId
      });
      if (_.isUndefined(server)) {
        return exits.notFound()
      }
      if (!sails.hooks.sdtdlogs.getStatus(inputs.serverId)) {
        await sails.hooks.sdtdlogs.start(inputs.serverId);
      } else {
        await sails.hooks.sdtdlogs.stop(inputs.serverId)
      }
      let status = sails.hooks.sdtdlogs.getStatus(inputs.serverId)
      sails.log.debug(`API - SdtdServer:logging-toggle - New status for server ${inputs.serverId} is ${status}`);
      return exits.success(status)
    } catch (error) {
      sails.log.error(`API - SdtdServer:logging-toggle - ${error}`);
    }


  }


};
