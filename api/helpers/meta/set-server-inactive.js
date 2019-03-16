module.exports = {


  friendlyName: 'Set server inactive',


  description: 'Stops all hooks, timers, modules for a server',


  inputs: {

    serverId: {
      type: 'string',
      required: true,
    }

  },


  exits: {

  },


  fn: async function (inputs, exits) {

    const server = await SdtdServer.findOne(inputs.serverId);
    if (_.isUndefined(server)) {
      return exits.error('Unknown server ID');
    }
    
    await sails.hooks.countryban.stop(server.id);

    await sails.hooks.sdtdlogs.stop(server.id);

    await SdtdConfig.update({
      server: server.id
    }, {
      inactive: true
    });
    sails.log.info(`Server has been marked as inactive.`, _.omit(server, 'authName', 'authToken'));
    return exits.success();

  }


};
