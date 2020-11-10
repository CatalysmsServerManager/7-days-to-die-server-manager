const hhmmss = require('@streammedev/hhmmss');

module.exports = {


  friendlyName: 'Load system stats and info',


  description: '',


  inputs: {

  },


  exits: {

  },


  fn: async function (inputs, exits) {

    let discordClient = sails.hooks.discordbot.getClient();
    let amountOfDiscordGuilds = discordClient.guilds.cache.size;
    let amountOfOnlineDiscordUsers = discordClient.users.cache.size;

    let amountOfServers = await SdtdServer.count();
    let amountOfPlayers = await Player.count();


    let uptime = hhmmss(process.uptime());

    let response = {
      servers: amountOfServers,
      players: amountOfPlayers,
      guilds: amountOfDiscordGuilds,
      users: amountOfOnlineDiscordUsers,
      uptime: uptime
    };

    return exits.success(response);

  }


};
