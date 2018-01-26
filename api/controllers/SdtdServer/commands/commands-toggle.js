module.exports = {


  friendlyName: 'Commands toggle',


  description: 'Toggle the SdtdCommandsHook',


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
   * @name commands-toggle
   * @method
   * @description Toggles the status of the commands hook for a server
   * @param {string} serverId
   */


  fn: async function (inputs, exits) {

    try {
      sails.log.debug(`API - SdtdServer:commands-toggle - Toggling commands for server ${inputs.serverId}`);

      let server = await SdtdServer.findOne({
        id: inputs.serverId
      });
      let config = await SdtdConfig.find({
        server: inputs.serverId
      });

      if (config.length > 1) {
          return exits.badRequest(`Found more than one config for this server`)
      }

      config = config[0]

      if (_.isUndefined(server)) {
        return exits.notFound()
      }

      let commandStatus = sails.hooks.sdtdcommands.getStatus(inputs.serverId)

      if (!commandStatus) {
        config.commandsEnabled = true
      } else {
        config.commandsEnabled = false
      }

      await sails.hooks.sdtdcommands.updateConfig(inputs.serverId, config)
      let status = sails.hooks.sdtdcommands.getStatus(inputs.serverId)

      sails.log.debug(`API - SdtdServer:commands-toggle - New status for server ${inputs.serverId} is ${status}`);

      return exits.success(status)
    } catch (error) {
      sails.log.error(`API - SdtdServer:commands-toggle - ${error}`);
      return exits.error(error)
    }


  }


};
