module.exports = {

  friendlyName: 'Get server roles',

  description: '',

  inputs: {
    serverId: {
      type: 'number',
      required: true,
      custom: async (valueToCheck) => {
        let foundServer = await SdtdServer.findOne(valueToCheck);
        return foundServer;
      },
    }

  },

  exits: {
    success: {}
  },


  fn: async function (inputs, exits) {

    let server =  await SdtdServer.findOne(inputs.serverId).populate('config');

    let foundRoles = new Array();
    if (server.config[0].discordGuildId) {
      let discordClient = await sails.hooks.discordbot.getClient();
      let discordGuild = await discordClient.guilds.get(server.config[0].discordGuildId);
      if (!_.isUndefined(discordGuild)) {
        foundRoles = discordGuild.roles.array();
      }

    }

    return exits.success(foundRoles);
  }
};
