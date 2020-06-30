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
      isIn: ['cpm', 'allocs']
    }

  },

  exits: {

    success: {},


  },

  fn: async function (inputs, exits) {

    if (inputs.mod.includes('cpm')) {
      inputs.mod = 'Mod CSMM Patrons';
    }

    if (inputs.mod.includes('allocs')) {
      inputs.mod = 'Mod Allocs MapRendering and Webinterface';
    }
    let apiResponse;

    try {
      apiResponse = await sails.helpers.sdtd.checkModVersion(inputs.mod, inputs.serverId);
    } catch (error) {
      return exits.success(0);
    }

    return exits.success(apiResponse);
  }
};
