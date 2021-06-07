// should be locked down by the wildcard in policies - sdtdServerController
module.exports = {
  friendlyName: 'Set server settings',
  description: 'Sets all the various sdtd settings',
  inputs: {
    serverId: {
      description: 'Id of the server',
      required: true,
      type: 'string'
    },

    mapProxy: {
      type: 'boolean',
    },

    countryBanListMode: {
      type: 'boolean'
    },

    replyPrefix: {
      type: 'string'
    },

    replyServerName: {
      type: 'string',
      maxLength: 25
    },

    serverSentEvents: {
      type: 'boolean',
    },
  },
  exits: {
    badRequest: {
      responseType: 'badRequest',
    },
  },
  fn: async function (inputs, exits) {

    let server = await SdtdServer.findOne(inputs.serverId);
    if (!server) {
      return exits.badRequest('Unknown server ID');
    }

    const updates = {};

    if ('mapProxy' in inputs) {
      updates.mapProxy = inputs.mapProxy;
    }
    if ('countryBanListMode' in inputs) {
      updates.countryBanListMode = inputs.countryBanListMode;
    }

    if ('replyPrefix' in inputs) {
      updates.replyPrefix = inputs.replyPrefix;
    }

    if ('replyServerName' in inputs) {
      updates.replyServerName = inputs.replyServerName;
    }

    if ('serverSentEvents' in inputs) {
      updates.serverSentEvents = inputs.serverSentEvents;
    }
    sails.log.info(`ServerId ${inputs.serverId} updated settings to ${JSON.stringify(updates)}.`);

    await SdtdConfig.update(
      { server: server.id },
      updates
    );

    return exits.success();

  }


};

