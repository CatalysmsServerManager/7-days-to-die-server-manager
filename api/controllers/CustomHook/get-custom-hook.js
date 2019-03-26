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

      response = response.map(async hook => {
        hook.lastResult = await sails.helpers.redis.get(`hooks:${hook.id}:lastResult`);

        if (!_.isNull(hook.lastResult) && sails.helpers.etc.isJson(hook.lastResult)) {
          hook.lastResult = JSON.parse(hook.lastResult);
        }

        return hook;
      });

      response = await Promise.all(response);

    }

    if (!_.isUndefined(inputs.hookId)) {
      let result = await CustomHook.findOne({
        id: inputs.hookId
      }).populate('variables');
      response = result;
      response.lastResult = await sails.helpers.redis.get(`hooks:${response.id}:lastResult`);

      if (!_.isNull(response.lastResult) && sails.helpers.etc.isJson(response.lastResult)) {
        response.lastResult = JSON.parse(response.lastResult);
      }

    }

    return exits.success(response);

  }


};
