module.exports = {


  friendlyName: 'Set active status',


  description: 'If a server is marked as inactive, no CSMM functions will be enabled for that server.',


  inputs: {
    serverId: {
      description: 'Id of the server',
      required: true,
      type: 'string'
    },

    inactive: {
      type: 'boolean',
      required: true
    }

  },


  exits: {

    badRequest: {
      responseType: 'badRequest',
    },

  },

  fn: async function (inputs, exits) {

    let server = await SdtdServer.findOne(inputs.serverId);

    if (_.isUndefined(server)) {
      return exits.badRequest('Unknown server ID');
    }

    if (inputs.inactive) {
      await sails.helpers.meta.setServerInactive(server.id);
    } else {
      await sails.helpers.meta.setServerActive(server.id);
    }

    return exits.success();

  }


};
