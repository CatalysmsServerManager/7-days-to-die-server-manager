module.exports = {
  friendlyName: 'Execute a discord request',
  inputs: {

    channelId: {
      required: true,
      type: 'string',
      regex: /[\d]{18}$/
    },

    content: {
      type: 'string',
      minLength: 1,
      maxLength: 1800
    },

    embed: {
      type: 'json',
      custom: (val) => {
        // Check the shape of the object
        return (
          val.title &&
          val.url &&
          val.fields
        );
      }
    },

  },

  exits: {},

  fn: async function (inputs, exits) {
    try {

      if (!inputs.content && !inputs.embed) {
        return exits.error(new Error('Invalid usage, must provide either content or embed'));
      }

      await sails.helpers.discord.discordrequest(
        `channels/${inputs.channelId}/messages`,
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

