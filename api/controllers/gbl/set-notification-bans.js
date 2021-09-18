module.exports = {


  friendlyName: 'set notification bans',


  description: 'Set the amount of bans needed for GBL notification',


  inputs: {
    serverId: {
      required: true,
      type: 'string'
    },
    bans: {
      required: true,
      type: 'number',
      min: 0
    }
  },


  exits: {

    notFound: {
      description: 'Server with given ID not found in the system',
      responseType: 'notFound'
    },

  },

  fn: async function (inputs, exits) {

    sails.log.info(`Setting amount of bans for GBL notification to ${inputs.bans} for server ${inputs.serverId}`, {serverId: inputs.serverId});

    await SdtdConfig.update({server: inputs.serverId}, {gblNotificationBans: inputs.bans});

    return exits.success();

  }


};
