// The CPM mod was renamed over time; all of these provide say2/pm2.
const CPM_MOD_NAMES = [
  'Mod CSMM Patrons',
  'Mod 1CSMM_Patrons',
  'Mod PrismaCore',
  'Mod 1PrismaCore',
  'Mod ServerCore',
  'Mod 1ServerCore',
];

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
      const server = await SdtdServer.findOne(inputs.serverId);
      const versionResult = await sails.helpers.sdtdApi.executeConsoleCommand(SdtdServer.getAPIConfig(server), 'version');
      const modLine = versionResult.result
        .split('\n')
        .find(line => CPM_MOD_NAMES.some(modName => line.startsWith(modName)));
      const detectedVersion = modLine ? parseFloat(_.trim(modLine.split(':').pop())) || 0 : 0;
      await sails.helpers.redis.set(`server:${inputs.serverId}:cpm-version`, detectedVersion, true, 600);
      version = detectedVersion;
    }
    sails.log.debug(`Detected CPM version ${version} for server ${inputs.serverId}`, { serverId: inputs.serverId });
    return exits.success(parseFloat(version));

  }
};
