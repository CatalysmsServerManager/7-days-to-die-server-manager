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
    }, async (error, uploadedFiles) => {
      if (error) {
        sails.log.error(error);
        return exits.error(error);
      }

      if (!uploadedFiles[0]) {
        return exits.badRequest('No files uploaded');
      }
      sails.log.warn(`Importing a new server!`);

      const data = await fs.readFile(uploadedFiles[0].fd);

      try {
        const server = await sails.helpers.meta.importServer(data, userId || this.req.session.userId);
        await fs.unlink(uploadedFiles[0].fd);
        return exits.success(server);
      } catch (error) {
        sails.log.error(error);
        return exits.badRequest('Error while importing server, see logs for details');
      }
    });

  }


};
