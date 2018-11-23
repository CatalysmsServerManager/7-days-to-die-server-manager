module.exports = {


  friendlyName: 'Check CPM version',


  description: 'Gets the CPM version of a server from the cache.',


  inputs: {

    serverId: {
      required: true,
      type: 'string'
    },

  },


  exits: {

  },


  fn: async function (inputs, exits) {

    let version;

    version = await sails.helpers.redis.get(`server:${inputs.serverId}:cpm-version`);

    if (!version) {
        let apiResponse = await sails.helpers.sdtd.checkModVersion('Mod CSMM Patrons', inputs.serverId);
        await sails.helpers.redis.set(`server:${inputs.serverId}:cpm-version`, apiResponse);
        version = apiResponse;
    }
    sails.log.debug(`Detected CPM version ${version} for server ${inputs.serverId}`);
    return exits.success(parseFloat(version));

  }
};
