const fs = require('fs').promises;

module.exports = {


  friendlyName: 'Export server',


  description: '',


  inputs: {
    serverId: {
      type: 'number',
    }
  },


  exits: {

  },


  fn: async function ({ serverId }, exits) {
    const result = await sails.helpers.meta.exportServer(serverId);
    const fileName = `./exports/server-${serverId}.json`;

    await fs.mkdir('./exports', { recursive: true });
    await fs.writeFile(fileName, JSON.stringify(result));
    this.res.download(fileName, `export-server-${serverId}.json`, async (err) => {
      await fs.unlink(fileName);
      if (err) {
        sails.log.error(err);
        return exits.error(err);
      } else {
        return exits.success();
      }
    });
  }


};
