const Commando = require('discord.js-commando');

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

    client = new Commando.Client({
      owner: sails.config.custom.botOwners,
      unknownCommandResponse: false,
      invite: process.env.INVITELINK
    });

    return exits.success(client);
  },
};

