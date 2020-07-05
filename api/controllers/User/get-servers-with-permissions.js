module.exports = {

  friendlyName: 'Get servers with permissions',

  description: 'Find servers for which this user has some permissions',

  inputs: {
    userId: {
      description: 'The ID of the user to look up.',
      type: 'number',
      required: true
    }
  },

  exits: {
    success: {},
    notFound: {
      description: 'No player with the specified ID was found in the database.',
      responseType: 'notFound'
    }
  },


  fn: async function (inputs, exits) {
    const objectToSend = await sails.helpers.user.getServersWithPermission(inputs.userId);
    sails.log.debug(`API - User:getServersWithPermissions - Found ${objectToSend.length} servers for user ${inputs.userId}`);
    return exits.success(objectToSend);
  }
};
