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

    chatBridgeDCPrefix: {
      type: 'string'
    },

    chatBridgeDCSuffix: {
      type: 'string'
    },

    playerCleanupLastOnline: {
      type: 'number',
      min: 7,
      allowNull: true
    }
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

    if ('countryBanListMode' in inputs) {
      updates.countryBanListMode = inputs.countryBanListMode;
    }

    if ('replyPrefix' in inputs) {
      updates.replyPrefix = inputs.replyPrefix;
    }

    if ('chatBridgeDCPrefix' in inputs) {
      updates.chatBridgeDCPrefix = inputs.chatBridgeDCPrefix;
    }

    if ('chatBridgeDCSuffix' in inputs) {
      updates.chatBridgeDCSuffix = inputs.chatBridgeDCSuffix;
    }
    
    if ('replyServerName' in inputs) {
      updates.replyServerName = inputs.replyServerName;
    }

    if ('playerCleanupLastOnline' in inputs) {
      updates.playerCleanupLastOnline = inputs.playerCleanupLastOnline;
    }

    sails.log.info(`ServerId ${inputs.serverId} updated settings.`, {serverId: inputs.serverId, newSettings: updates});

    await SdtdConfig.update(
      { server: server.id },
      updates
    );

    return exits.success();

  }


};

