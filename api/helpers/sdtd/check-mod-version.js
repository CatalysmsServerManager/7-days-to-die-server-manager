const SdtdApi = require('7daystodie-api-wrapper');

module.exports = {


  friendlyName: 'Check mod version',


  description: '',


  inputs: {

    modName: {
      required: true,
      type: 'string'
    },

    serverId: {
      required: true,
      type: 'string'
    },

  },


  exits: {

  },


  fn: async function (inputs, exits) {

    let server = await SdtdServer.findOne(inputs.serverId);

    if (_.isUndefined(server)) {
      return exits.error(new Error('No server found'))
    }

    let versionResult = await SdtdApi.executeConsoleCommand({
      ip: server.ip,
      port: server.webPort,
      adminToken: server.authToken,
      adminUser: server.authName
    }, 'version');

    let modsArray = versionResult.result.replace('\r', '').split('\n');

    let versionToFindLine = new String();

    for (const modLine of modsArray) {
      if (modLine.startsWith(inputs.modName)) {
        versionToFindLine = modLine
      }
    }

    let splitVersionLine = versionToFindLine.split(":");

    let versionNumber = _.trim(splitVersionLine[splitVersionLine.length - 1]);
      if (versionNumber === '') {
        versionNumber = 0
      }

    // All done.
    return exits.success(parseFloat(versionNumber));

  }


};

