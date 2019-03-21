/**
 * UsageStats.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

    discordGuilds: {
      type: 'number'
    },

    discordUsers: {
      type: 'number'
    },

    servers: {
      type: 'number'
    },

    players: {
      type: 'number'
    },

    teleportLocations: {
      type: 'number'
    },

    timesTeleported: {
      type: 'number'
    },

    customCommands: {
      type: 'number'
    },

    customCommandsUsed: {
      type: 'number'
    },

    chatBridges: {
      type: "number"
    },

    countryBans: {
      type: "number"
    },

    ingameCommands: {
      type: "number"
    },

    gblEntries: {
      type: "number"
    },

    cronJobs: {
      type: "number"
    },

    pingKickers: {
      type: "number"
    },

    openTickets: {
      type: "number"
    },

    closedTickets: {
      type: "number"
    },

    gblComments: {
      type: "number"
    }

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

  },

};
