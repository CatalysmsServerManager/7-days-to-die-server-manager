module.exports = {

  friendlyName: 'Get mod version',

  description: '',

  inputs: {

    serverId: {
      description: 'Id of the SdtdServer',
      type: 'string',
      required: true
    },

    mod: {
      type: 'string',
      required: true,
      isIn: ['cpm', 'allocs', 'prismacore', 'servercore']
    }

  },

  exits: {

    success: {},


  },

  fn: async function (inputs, exits) {

    let apiResponse;

    try {
      if (inputs.mod === 'allocs') {
        apiResponse = await sails.helpers.sdtd.checkModVersion('Mod Allocs MapRendering and Webinterface', inputs.serverId);
      } else {
        apiResponse = await sails.helpers.sdtd.checkCpmVersion(inputs.serverId);
      }
    } catch (error) {
      return exits.success(0);
    }

    return exits.success(apiResponse);
  }
};
