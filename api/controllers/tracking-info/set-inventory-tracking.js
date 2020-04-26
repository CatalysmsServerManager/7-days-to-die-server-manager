const sevenDays = require('7daystodie-api-wrapper');

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
      let runningPatch
      try {
        runningPatch = await checkIfRunningAlloc26(server);
      } catch (error) {
        return exits.notRunningPatch(`You must run Allocs webmap version greater than (or equal) 26! CSMM could not detect your version correctly!`)

      }
      if (!runningPatch) {
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


async function checkIfRunningAlloc26(sdtdServer) {
  try {
    const response = await sevenDays.executeConsoleCommand(SdtdServer.getAPIConfig(sdtdServer), 'version');
    let splitResult = response.result.split('\n');
    let mapRenderingEntry = _.find(splitResult, (versionLine) => {
      return versionLine.startsWith('Mod Allocs MapRendering and Webinterface:')
    })
    detectedVersion = parseInt(mapRenderingEntry.replace('Mod Allocs MapRendering and Webinterface: ', '').replace('\r', '').replace('\n', ''));
    return detectedVersion > 26;
  } catch (error) {
    return false;
  }
}
