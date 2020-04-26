const sevenDaysAPI = require("7daystodie-api-wrapper");

/**
 * SdtdServer.js
 *
 * @description  Represents a 7 Days to Die server
 * @class SdtdServer
 */

module.exports = {
  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

    /**
     * @memberof SdtdServer
     * @var {string} name
     */

    name: {
      type: 'string'
    },

    /**
     * @var {string} ip
     * @memberof SdtdServer
     */

    ip: {
      type: 'string',
      required: true
    },

    /**
     * @var {string} forceHttps
     * @memberof SdtdServer
     * @description Should we speak to the server using http (false), https (true) or detect based on port
     */

    forceHttps: {
      type: 'json',
      required: false
    },

    /**
     * @memberof SdtdServer
     * @var {number} port
     * @description Port provided by Alloc's webserver
     */

    webPort: {
      type: 'number',
    },

    /**
     * @memberof SdtdServer
     * @var {number} port
     * @description (alias) Port provided by Alloc's webserver
     */

    /**
     * @memberof SdtdServer
     * @var {string} authName
     * @description adminuser to use during webrequests
     */

    authName: {
      type: 'string'
    },

    /**
     * @memberof SdtdServer
     * @var {string} authToken
     * @description admintoken to use during webrequests
     */

    authToken: {
      type: 'string'
    },

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

    /**
     * @memberof SdtdServer
     * @var owner
     * @description Owner of the server, corresponds to a User
     */

    owner: {
      model: 'user',
      required: true
    },

    /**
     * @memberof SdtdServer
     * @var admins
     * @description Users allowed to perform admin actions on the server
     */

    admins: {
      collection: 'user',
      via: 'adminOf'
    },

    /**
     * @memberof SdtdServer
     * @var players
     * @description Collection of Players that have logged on the server
     */

    players: {
      collection: 'player',
      via: 'server'
    },

    /**
     * @memberof SdtdServer
     * @var tickets
     * @description Collection of SdtdTickets
     */

    tickets: {
      collection: 'sdtdticket',
      via: 'server'
    },

    config: {
      collection: 'SdtdConfig',
      via: 'server'
    },

    historicalInfo: {
      collection: 'historicalinfo',
      via: 'server'
    },

    cronJobs: {
      collection: 'CronJob',
      via: 'server'
    },
  },

};

module.exports.getAPIConfig = function getAPIConfig(server) {
  return {
    ip: server.ip,
    port: server.webPort,
    forceHttps: server.forceHttps,
    adminUser: server.authName,
    adminToken: server.authToken,
  }
}
