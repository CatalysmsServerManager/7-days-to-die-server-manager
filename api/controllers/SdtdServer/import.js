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

  },


  fn: async function ({ userId }, exits) {
    const file = this.req.file('file');

    file.upload({
      maxBytes: 50000000
    }, async (err, uploadedFiles) => {
      if (err) {
        return exits.error(err);
      }

      const data = await fs.readFile(uploadedFiles[0].fd);
      const server = await sails.helpers.meta.importServer(data, userId || this.req.session.userId);
      await fs.unlink(uploadedFiles[0].fd);
      console.log(server);

      return exits.success(server);
    });

  }


};
