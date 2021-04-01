const fs = require('fs').promises;
module.exports = {


  friendlyName: 'Import server',


  description: '',


  inputs: {
    userId: {
      type: 'string',
      required: false
    }
  },


  exits: {
    badRequest: {
      responseType: 'badRequest'
    }
  },


  fn: async function ({ userId }, exits) {
    const file = this.req.file('file');

    file.upload({
      maxBytes: 50000000
    }, async (err, uploadedFiles) => {
      if (err) {
        sails.log.err(err);
        return exits.error(err);
      }

      if (!uploadedFiles[0]) {
        return exits.badRequest('No files uploaded');
      }
      sails.log.warn(`Importing a new server!`);

      const data = await fs.readFile(uploadedFiles[0].fd);
      const server = await sails.helpers.meta.importServer(data, userId || this.req.session.userId);
      await fs.unlink(uploadedFiles[0].fd);
      return exits.success(server);
    });

  }


};
