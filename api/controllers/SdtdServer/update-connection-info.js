const sevenDays = require('machinepack-7daystodiewebapi');

module.exports = {


  friendlyName: 'Update connection info',


  description: 'Update ip, port, authname and/or authtoken for a sdtdServer',


  inputs: {
    serverId: {
      required: true,
      type: 'string'
    },
    serverIp: {
      type: 'string',
      minLength: 2,
      maxLength: 100
    },

    webPort: {
      type: 'number',
      min: 50,
      max: 100000
    },

    authName: {
      type: 'string',
      minLength: 2,
      maxLength: 200,
    },

    authToken: {
      type: 'string',
      minLength: 10,
      maxLength: 200,
    },
    serverName: {
      type: 'string',
      minLength: 6,
      maxLength: 200,
    }
  },


  exits: {

    badRequest: {
      description: 'Server with given ID not found in the system',
      responseType: 'badRequest'
    },
    success: {}

  },

  /**
   * @memberof SdtdServer
   * @name update-connection-info
   * @method
   * @description Updates basic connection info for a server in the DB
   * @param {string} serverId
   * @param {string} serverIp
   * @param {number} webPort
   * @param {string} authName
   * @param {string} authToken
   */


  fn: async function (inputs, exits) {

    try {

      let server = await SdtdServer.findOne(inputs.serverId);

      if (_.isUndefined(server)) {
        return exits.badRequest(`Unknown server ID`);
      }

      let updateObject = {
        ip: _.isUndefined(inputs.serverIp) ? undefined : inputs.serverIp,
        webPort: _.isUndefined(inputs.webPort) ? undefined : inputs.webPort,
        authName: _.isUndefined(inputs.authName) ? undefined : inputs.authName,
        authToken: _.isUndefined(inputs.authToken) ? undefined : inputs.authToken,
        name: _.isUndefined(inputs.serverName) ? undefined : inputs.serverName,
      };

      await SdtdServer.update({
        id: inputs.serverId
      }, updateObject);

      let loggingObject = sails.hooks.sdtdlogs.getLoggingObject(inputs.serverId);

      if (!_.isUndefined(loggingObject)) {
        loggingObject.ip = _.isUndefined(inputs.serverIp) ? loggingObject.ip : inputs.serverIp;
        loggingObject.port = _.isUndefined(inputs.webPort) ? loggingObject.port : inputs.webPort;
        loggingObject.adminUser = _.isUndefined(inputs.authName) ? loggingObject.adminUser : inputs.authName;
        loggingObject.adminToken = _.isUndefined(inputs.authToken) ? loggingObject.adminToken : inputs.authToken;

        if (!_.isUndefined(loggingObject._getLatestLogLine)) {
          // Make sure we are on the correct log line.
          loggingObject._getLatestLogLine();
        }

      }


      sails.log.info(`API - SdtdServer:update-connection-info - Updated connection info for server ${inputs.serverId}`, _.omit(inputs, ["authName", "authToken"]));
      return exits.success();
    } catch (error) {
      sails.log.error(`API - SdtdServer:update-connection-info - ${error}`);
      return exits.error(error);
    }


  }


};
