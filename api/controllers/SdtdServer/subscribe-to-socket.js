module.exports = {


  friendlyName: 'Subscribe to socket',


  description: 'Subscribe a client to their server socket',


  inputs: {
    serverId: {
      description: 'Id of the server',
      required: true,
      type: 'string'
    }

  },


  exits: {

    serverNotFound: {
      description: 'Server with the specified ID was not found in the system'
    },
    notASocket: {
      description: 'Client that made the request is not a socket'
    }

  },

  /**
   * @memberof SdtdServer
   * @method
   * @description Subscribe to a socket to receive event notifications
   * @name subscribe-to-socket
   * @param {serverId}
   */

  fn: async function (inputs, exits) {

    if (!this.req.isSocket) {
      throw 'notASocket';
    }

    try {
      let server = await SdtdServer.findOne({id: inputs.serverId});
      if (_.isUndefined(server)) {
        throw serverNotFound;
      }
      sails.sockets.join(this.req, inputs.serverId);
      sails.log.debug(`API - SdtdServer:subscribeToSocket - Successfully connected server ${inputs.serverId}`);
    } catch (error) {
      sails.log.error(`API - SdtdServer:subscribeToSocket - ${error}`);
      return exits.error(error);
    }

    return exits.success();

  }


};
