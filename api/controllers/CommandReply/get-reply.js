const replyTypes = require('../../../worker/processors/sdtdCommands/replyTypes');

module.exports = {
  friendlyName: 'Get reply',
  description: '',

  inputs: {

    serverId: {
      type: 'string',
      required: true,
    },

    type: {
      type: 'string',
      isIn: replyTypes.map(r => r.type),
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
