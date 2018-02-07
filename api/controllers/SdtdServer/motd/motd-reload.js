module.exports = {


  friendlyName: 'MOTD reload',


  description: 'Reload server config 7dtdMOTDHook',


  inputs: {
    serverId: {
      required: true,
      type: 'string'
    },
    newMessage: {
      type: 'string'
    },
    newDelay: {
      type: 'number'
    },
    newStatusOnJoin: {
      type: 'boolean'
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
    invalidInput: {
      description: 'invalid inputs',
      responseType: 'badRequest'
    }

  },

  /**
   * @memberof SdtdServer
   * @name motd-reload
   * @method
   * @description Reloads the config of the country ban hook for a server
   * @param {string} serverId
   */


  fn: async function (inputs, exits) {

    try {
      sails.log.debug(`API - SdtdServer:motd-reload - Reloading config for server ${inputs.serverId}`);
      let server = await SdtdServer.findOne({
        id: inputs.serverId
      });
      let config = await SdtdConfig.findOne({
        server: server.id
      });

      if (_.isUndefined(server)) {
        return exits.notFound();
      }

      if (!_.isUndefined(inputs.newDelay) && inputs.newDelay != '0') {
        if (isNaN(inputs.newDelay) || (10 > inputs.newDelay) || (2000 < inputs.newDelay) || !Number.isInteger(Number(inputs.newDelay))) {
          return exits.invalidInput();
        }
      }

      await sails.hooks.sdtdmotd.updateConfig(inputs.serverId,
        _.isUndefined(inputs.newMessage) ? config.motdMessage : inputs.newMessage,
        _.isUndefined(inputs.newDelay) ? config.motdInterval : inputs.newDelay,
        config.motdEnabled,
        _.isUndefined(inputs.newStatusOnJoin) ? config.motdOnJoinEnabled : inputs.newStatusOnJoin
      );

      sails.log.debug(`API - SdtdServer:motd-reload - Reloaded config for server ${inputs.serverId}`);

      return exits.success();
    } catch (error) {
      sails.log.error(`API - SdtdServer:motd-reload - ${error}`);
      return exits.error(error);
    }


  }


};
