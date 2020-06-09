module.exports = {


  friendlyName: 'Check donator status',


  description: 'Checks what donor features a server or user can use',


  inputs: {

    serverId: {
      type: 'number'
    },
    userId: {
      type: 'number'
    },

    reload: {
      type: 'boolean',
      defaultsTo: false,
    },

  },


  exits: {

  },


  fn: async function (inputs, exits) {

    let donorStatus;

    if (_.isUndefined(inputs.serverId) && _.isUndefined(inputs.userId)) {
      return exits.error(`Must provide serverId OR userId parameter.`);
    }

    if (!_.isUndefined(inputs.serverId)) {
      let currentStatus = await sails.helpers.redis.get(`server:${inputs.serverId}:donorStatus`);

      if (_.isNull(currentStatus) || inputs.reload) {
        currentStatus = await sails.helpers.meta.getDonatorStatus(inputs.serverId);
        await sails.helpers.redis.set(`server:${inputs.serverId}:donorStatus`, currentStatus);
      }
      donorStatus = currentStatus;
    }

    if (!_.isUndefined(inputs.userId)) {
      let currentStatus = await sails.helpers.redis.get(`user:${inputs.userId}:donorStatus`);

      if (_.isNull(currentStatus) || inputs.reload) {
        currentStatus = await sails.helpers.meta.getDonatorStatus(undefined, inputs.userId);
        await sails.helpers.redis.set(`user:${inputs.userId}:donorStatus`, currentStatus);
      }
      donorStatus = currentStatus;
    }

    return exits.success(donorStatus || "free");
  }


};
