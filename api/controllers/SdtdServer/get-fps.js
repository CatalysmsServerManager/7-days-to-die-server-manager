module.exports = {


  friendlyName: 'Get fps',

  inputs: {
    serverId: {
      required: true,
      example: 4
    }

  },

  exits: {
    badRequest: {
      responseType: 'badRequest'
    },
    notFound: {
      responseType: 'notFound',
      description: 'Server was not found in DB'
    }
  },

  fn: async function (inputs, exits) {
    try {
      let fps = await sails.helpers.sdtd.loadFps(inputs.serverId);
      return exits.success(fps);
    } catch (error) {
      return exits.success(0);
    }
  }


};
