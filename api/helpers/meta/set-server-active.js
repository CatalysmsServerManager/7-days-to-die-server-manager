module.exports = {


  friendlyName: 'Set server active',


  description: 'Starts all hooks, timers, modules for a server that was inactive',


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

    await SdtdConfig.update({
      server: server.id
    }, {
      inactive: false
    });
    sails.log.info(`Server has been marked as active.`, _.omit(server, 'authName', 'authToken'));

    return exits.success();
  }


};
