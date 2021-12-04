module.exports = {


  friendlyName: 'Load sdtdServer info',


  description: 'Performs several API requests to a sdtd server',


  inputs: {
    serverId: {
      friendlyName: 'Server ID',
      required: true,
      example: 1
    }
  },


  exits: {
    success: {
      outputFriendlyName: 'Success'
    },
    connectionError: {
      description: 'Could not connect to the 7 days to die server'
    },
    databaseError: {
      description: 'Error reading or writing data to DB'
    }
  },

  fn: async function (inputs, exits) {
    const server = await SdtdServer.findOne(inputs.serverId);
    server.stats = await sails.helpers.sdtdApi.getStats(SdtdServer.getAPIConfig(server));
    server.serverInfo = await loadServerInfo(server);
    sails.log.debug(`HELPER - loadSdtdserverInfo - Loaded server info for server ${server.name}`, { server });
    exits.success(server);
  }
};

async function loadServerInfo(server) {
  const data = await sails.helpers.sdtdApi.getServerInfo(SdtdServer.getAPIConfig(server));

  for (const dataPoint in data) {
    if (data.hasOwnProperty(dataPoint)) {
      data[dataPoint] = data[dataPoint].value;
    }
  }
  return data;
}
