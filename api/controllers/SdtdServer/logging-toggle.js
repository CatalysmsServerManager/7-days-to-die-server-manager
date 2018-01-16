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
      description: 'Server with given ID not found in the system'
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
      let status
      if (sails.hooks.sdtdlogs.getStatus(inputs.serverId)) {
        sails.hooks.sdtdlogs.start(inputs.serverId);
        status = true
      } else {
        sails.hooks.sdtdlogs.stop(inputs.serverId)
        status = false
      }
      return exits.success(status)
    } catch (error) {
      sails.log.error(`API - SdtdServer:logging-toggle - ${error}`);
    }


  }


};
