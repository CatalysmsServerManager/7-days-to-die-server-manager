module.exports = {


  friendlyName: 'Check permission',


  description: '',


  inputs: {

    permissionField: {
      type: 'string',
      required: true,
    },

    serverId: {
      type: 'number',
      required: true
    },

    userId: {
      type: 'number'
    },

    playerId: {
      type: 'number'
    }

  },


  exits: {

  },


  fn: async function (inputs, exits) {

    if ((_.isUndefined(inputs.userId) || _.isUndefined(inputs.serverId)) && _.isUndefined(inputs.playerId)) {
      return exits.invalidInput('You must provide either userId AND serverID or just a playerId' + JSON.stringify(inputs) );
    }

    let options = new Object();

    options.permission = inputs.permissionField;

    if (inputs.playerId) {
      options.playerId = inputs.playerId
    }

    if (inputs.serverId) {
      options.serverId = inputs.serverId
    }

    if (inputs.userId) {
      options.userId = inputs.userId
    }

    let permCheck = await sails.helpers.roles.checkPermission.with(options);

    return exits.success(permCheck.hasPermission)

  }


};
