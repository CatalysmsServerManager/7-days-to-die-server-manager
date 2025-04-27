const { Client, GatewayIntentBits, Partials } = require('discord.js');

let client;

module.exports = {
  friendlyName: 'Get Discord client',
  inputs: {
  },

  exits: {},

  sync: true,

  fn: function (inputs, exits) {

    if (client) {
      return exits.success(client);
    }

    client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
      ],
      partials: [
        Partials.Channel
      ]
    });

    client.on('error', sails.log.error);

    return exits.success(client);
  },
};

