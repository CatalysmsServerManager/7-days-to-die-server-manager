module.exports = {

  friendlyName: 'Set prefix',

  inputs: {
    serverId: {
      required: true,
      type: 'number'
    },
    guildId: {
      required: true,
      type: 'string'
    },
    prefix: {
      required: true,
      type: 'string'
    }
  },

  exits: {
    success: {},
  },


  fn: async function (inputs, exits) {

    await SdtdConfig.update({ server: inputs.serverId }, { discordPrefix: inputs.prefix });
    let discordClient = sails.hooks.discordbot.getClient();
    let guild = discordClient.guilds.cache.get(inputs.guildId);
    if (guild) {
      guild.commandPrefix = inputs.prefix;
      return exits.success();
    } else {
      return exits.error();
    }

  }
};
