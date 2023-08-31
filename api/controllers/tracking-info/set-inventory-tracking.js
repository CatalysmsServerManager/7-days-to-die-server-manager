module.exports = {


  friendlyName: 'Set inventory tracking',


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

    notRunningPatch: {
      responseType: 'badRequest'
    }

  },


  fn: async function (inputs, exits) {

    if (inputs.newStatus === true) {
      let server = await SdtdServer.findOne(inputs.serverId);
      if (!server) {
        return exits.error(new Error('Missing server'));
      }

      let version;

      try {
        version = (await Promise.all([
          sails.helpers.sdtd.checkModVersion('Mod Allocs MapRendering and Webinterface', inputs.serverId),
          sails.helpers.sdtd.checkModVersion('Mod Allocs_Webinterface', inputs.serverId),
        ])).find(v => !!v) || 0;
      } catch (e) {
        return exits.error(e);
      }

      if (version < 26) {
        return exits.notRunningPatch(`You must run Allocs webmap version greater than (or equal) 26!`);
      }
    }
    await SdtdConfig.update({
      server: inputs.serverId
    }, {
      inventoryTracking: inputs.newStatus
    });
    sails.log.info(`Set inventory tracking for server ${inputs.serverId} to ${inputs.newStatus}`, { serverId: inputs.serverId });
    return exits.success();
  }
};
