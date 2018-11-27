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


function checkIfRunningAlloc26(sdtdServer) {
  return new Promise((resolve, reject) => {
    sevenDays.executeCommand({
      ip: sdtdServer.ip,
      port: sdtdServer.webPort,
      authName: sdtdServer.authName,
      authToken: sdtdServer.authToken,
      command: 'version'
    }).exec({
      success: (response) => {
        let splitResult = response.result.split('\n');
        let mapRenderingEntry = _.find(splitResult, (versionLine) => {
          return versionLine.startsWith('Mod Allocs MapRendering and Webinterface:')
        })
        detectedVersion = parseInt(mapRenderingEntry.replace('Mod Allocs MapRendering and Webinterface: ', '').replace('\r', '').replace('\n', ''));
        resolve(detectedVersion > 26)
      },
      unknownCommand: (error) => {
        resolve(false);
      },
      error: (error) => {
        resolve(false);
      }
    });

  })
}
