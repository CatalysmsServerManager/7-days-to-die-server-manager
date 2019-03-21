module.exports = {


  friendlyName: 'Get',


  description: 'Get custom hook.',


  inputs: {

    serverId: {
      type: 'string',
    },

    hookId: {
      type: 'string'
    },


  },


  exits: {

  },


  fn: async function (inputs, exits) {

    if (_.isUndefined(inputs.serverId) && _.isUndefined(inputs.hookId)) {
      return exits.error(`Must define either a server ID or a hook ID`);
    }

    let response;

    if (!_.isUndefined(inputs.serverId)) {
      let result = await CustomHook.find({
        server: inputs.serverId
      }).populate('variables');
      response = result;
    }

    if (!_.isUndefined(inputs.hookId)) {
      let result = await CustomHook.findOne({
        id: inputs.hookId
      }).populate('variables');
      response = result;
    }

    return exits.success(response);

  }


};
