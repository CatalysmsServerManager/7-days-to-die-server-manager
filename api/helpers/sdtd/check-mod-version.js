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

    let versionResult = await SdtdApi.executeConsoleCommand(SdtdServer.getAPIConfig(server), 'version');

    let modsArray = versionResult.result.replace('\r', '').split('\n');

    let versionToFindLine = new String();
    for (const modLine of modsArray) {
      if (modLine.startsWith(inputs.modName)) {
        versionToFindLine = modLine
      }
    }

    let splitVersionLine = versionToFindLine.split(":");

    if (inputs.modName === "Game version") {
      return exits.success(_.trim(splitVersionLine[splitVersionLine.length - 1]))
    }

    let versionNumber = _.trim(splitVersionLine[splitVersionLine.length - 1]);
    if (versionNumber === '') {
      versionNumber = 0
    }

    sails.log.debug(`Checked mod version of server ${inputs.serverId} for mod ${inputs.modName}. Found version ${versionNumber}`)
    return exits.success(parseFloat(versionNumber));

  }


};
