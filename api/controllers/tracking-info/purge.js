module.exports = {


  friendlyName: 'Purge tracking info',


  description: '',


  inputs: {

    serverId: {
      type: 'number',
      required: true,
      custom: async (valueToCheck) => {
        let foundServer = await SdtdServer.findOne(valueToCheck);
        return foundServer;
      },
    },

  },


  exits: {},


  fn: async function (inputs, exits) {
    await TrackingInfo.destroy({
      server: inputs.serverId
    });
    sails.log.info(`Deleted player tracking data for server ${inputs.serverId}`);
    return exits.success();
  }


};
