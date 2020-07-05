module.exports = {


  friendlyName: 'Get role',


  description: '',


  inputs: {

    roleId: {
      type: 'number',
      custom: async (valueToCheck) => {
        let foundRole = await Role.findOne(valueToCheck);
        return foundRole;
      },
    },

    serverId: {
      type: 'number',
      custom: async (valueToCheck) => {
        let foundServer = await SdtdServer.findOne(valueToCheck);
        return foundServer;
      },
    }

  },


  exits: {

  },


  fn: async function (inputs, exits) {

    if (_.isUndefined(inputs.roleId) && _.isUndefined(inputs.serverId)) {
      return exits.error(`Must provide either roleId or serverId`);
    }

    let returnObject;

    if (inputs.roleId) {
      returnObject = await Role.findOne(inputs.roleId);
    }

    if (inputs.serverId) {
      returnObject = await Role.find({server: inputs.serverId});
    }

    return exits.success(returnObject);

  }


};
