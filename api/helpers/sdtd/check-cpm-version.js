module.exports = {


  friendlyName: 'Check CPM version',


  description: 'Gets the CPM version of a server from the cache.',


  inputs: {

    serverId: {
      required: true,
      type: 'string'
    },

    refresh: {
      type: 'boolean',
      defaultsTo: false
    }

  },


  exits: {

  },


  fn: async function (inputs, exits) {

    let version;

    version = await sails.helpers.redis.get(`server:${inputs.serverId}:cpm-version`);

    if (!version || inputs.refresh) {
      let apiResponse
      try {
        apiResponse = await sails.helpers.sdtd.checkModVersion('Mod CSMM Patrons', inputs.serverId);
      } catch (e) {
        return exits.error(e);
      }
      await sails.helpers.redis.set(`server:${inputs.serverId}:cpm-version`, apiResponse, true, 600);
      version = apiResponse;
    }
    sails.log.debug(`Detected CPM version ${version} for server ${inputs.serverId}`);
    return exits.success(parseFloat(version));

  }
};
