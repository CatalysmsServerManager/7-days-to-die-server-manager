module.exports = {


  friendlyName: 'Set location tracking',


  description: '',


  inputs: {

    serverId: {
      type: 'number',
      custom: async (valueToCheck) => {
        let foundServer = await SdtdServer.findOne(valueToCheck);
        return foundServer;
      },
    },


    newStatus: {
      type: 'boolean'
    }

  },


  exits: {

  },


  fn: async function (inputs, exits) {

    await SdtdConfig.update({server: inputs.serverId}, {locationTracking: inputs.newStatus});
    sails.log.info(`Set location tracking for server ${inputs.serverId} to ${inputs.newStatus}`, {serverId: inputs.serverId});
    return exits.success();

  }


};
