module.exports = {
  friendlyName: 'Get reply',
  description: '',

  inputs: {

    serverId: {
      type: 'string',
    },

    type: {
      type: 'string',
      isIn: sails.hooks.sdtdcommands.replyTypes.map(r => r.type),
    }

  },


  exits: {

    badRequest: {
      description: '',
      statusCode: 400
    },

  },


  fn: async function (inputs, exits) {

    let response;

    if (_.isEmpty(inputs.serverId) && _.isEmpty(inputs.type)) {
      return exits.badRequest('You must provide either a server ID or a type');
    }

    response = await CommandReply.find({
      type: inputs.type,
      server: inputs.serverId
    });

    if (response.length === 0 && !_.isEmpty(inputs.type)) {
      let defaultConfig = sails.hooks.sdtdcommands.replyTypes.filter(r => r.type === inputs.type)[0];
      response = [{
        type: defaultConfig.type,
        reply: defaultConfig.default,
      }];
    }


    return exits.success(response);

  }


};
