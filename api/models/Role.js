/**
 * Role.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

    name: {
      type: "string",
      required: true
    },

    level: {
      type: "number",
      defaultsTo: 2000
    },

    // if true, csmm will use this role for any permission check where role is not explicitly set.
    isDefault: {
      type: "boolean",
      defaultsTo: false
    },

    amountOfTeleports: {
      type: "number",
      defaultsTo: 5
    },

    radiusAllowedToExplore: {
      type: "number",
      defaultsTo: 1000000
    },

    economyGiveMultiplier: {
      type: "number",
      defaultsTo: 1,
      min: 0
    },

    economyDeductMultiplier: {
      type: "number",
      defaultsTo: 1,
      min: 0
    },

    discordRole: {
      type: "string",
      allowNull: true
    },

    manageServer: {
      type: "boolean",
      defaultsTo: false
    },

    manageEconomy: {
      type: "boolean",
      defaultsTo: false
    },

    managePlayers: {
      type: "boolean",
      defaultsTo: false
    },

    manageTickets: {
      type: "boolean",
      defaultsTo: false
    },

    viewAnalytics: {
      type: "boolean",
      defaultsTo: false
    },

    viewDashboard: {
      type: "boolean",
      defaultsTo: false
    },

    useTracking: {
      type: "boolean",
      defaultsTo: false
    },

    useChat: {
      type: "boolean",
      defaultsTo: false
    },

    useCommands: {
      type: "boolean",
      defaultsTo: false
    },

    manageGbl: {
      type: "boolean",
      defaultsTo: false
    },

    discordExec: {
      type: "boolean",
      defaultsTo: false
    },

    discordLookup: {
      type: "boolean",
      defaultsTo: false
    },

    immuneToBannedItemsList: {
      type: "boolean",
      defaultsTo: false
    },

    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

    players: {
      collection: "player",
      via: "role"
    },

    server: {
      model: "sdtdServer",
      required: true
    }
  }
};
