module.exports = {
  friendlyName: 'Execute a discord request',
  inputs: {

    userId: {
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
        // instanceof would be ideal but sails is doing weird shit again
        // So just check the shape of the object
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

      const DMChannel = await sails.helpers.discord.discordrequest(
        `users/@me/channels`,
        'post',
        {
          'recipient_id': inputs.userId,
        }
      );

      await sails.helpers.discord.sendMessage(DMChannel.id, inputs.content, inputs.embed);
    } catch (e) {
      return exits.error(e);
    }

    return exits.success();
  },
};

