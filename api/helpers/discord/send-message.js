const { REST } = require('discord.js');

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
    },

  },

  exits: {},

  fn: async function (inputs, exits) {
    try {

      if (!inputs.content && !inputs.embed) {
        return exits.error(new Error('Invalid usage, must provide either content or embed'));
      }

      const response = await sails.helpers.discord.discordrequest(
        `channels/${inputs.channelId}/messages`,
        'post',
        {
          'content': inputs.content,
          'tts': false,
          'embeds': [inputs.embed.data]
        }
      );
      sails.log.debug(`Sent a message to channel ${inputs.channelId}`, { ...response, labels: { type: 'discord' } });
    } catch (e) {
      sails.log.error(`Error sending message to ${inputs.channelId}`, { error: e, labels: { type: 'discord' } });
      return exits.error(e);
    }

    return exits.success();
  },
};

