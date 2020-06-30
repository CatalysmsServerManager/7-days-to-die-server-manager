const sevenDays = require('machinepack-7daystodiewebapi');

let detectedVersion

module.exports = {


  friendlyName: 'Set inventory tracking',


  description: '',


  inputs: {

    serverId: {
      type: 'number',
      custom: async (valueToCheck) => {
        let foundServer = await SdtdServer.findOne(valueToCheck);
        return foundServer
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
      let runningPatch
      const version = await sails.helpers.sdtd.checkModVersion('Mod Allocs MapRendering and Webinterface', inputs.serverId);
      if (version < 26) {
        return exits.notRunningPatch(`You must run Allocs webmap version greater than (or equal) 26!`)
      }
    }
    await SdtdConfig.update({
      server: inputs.serverId
    }, {
      inventoryTracking: inputs.newStatus
    });
    sails.log.info(`Set inventory tracking for server ${inputs.serverId} to ${inputs.newStatus}`);
    return exits.success();
  }
};
