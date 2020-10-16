module.exports = {
  friendlyName: 'Execute a discord request',
  inputs: {

    channelId: {
      required: true,
      type: 'string',
      // TODO: Validate regex?
      // TODO: should this helper support sending DMs?
    },

    content: {
      type: 'string'
      // TODO: validate if its string
    },

    embed: {
      type: 'ref'
      // TODO: validate if its embed
    },

  },

  exits: {},

  fn: async function (inputs, exits) {
    try {
      await sails.helpers.discord.discordrequest(
        `/channels/${inputs.channelId}/messages`,
        'post',
        {
          'content': inputs.content,
          'tts': false,
          'embed': inputs.embed
        }
      );
    } catch (e) {
      return exits.error(e);
    }

    return exits.success();
  },
};

