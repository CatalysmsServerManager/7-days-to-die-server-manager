module.exports = {


  friendlyName: 'Cron export',


  description: '',


  inputs: {
    serverId: {
      type: 'number',
      required: true,
      custom: async (valueToCheck) => {
        let foundServer = await SdtdServer.findOne(valueToCheck);
        return foundServer;
      },
    }

  },


  exits: {
    success: {},

    invalidIds: {
      description: 'Must give either listing or server ID',
      responseType: 'badRequest',
      statusCode: 400
    }
  },


  fn: async function (inputs, exits) {

    try {

      let foundJobs = await CronJob.find({
        server: inputs.serverId
      });

      this.res.attachment(`cronjobs.json`);


      let jsonExport = JSON.stringify(foundJobs.map(job => {
        job = _.omit(job, 'createdAt', 'updatedAt', 'id', 'server');
        return job;
      }));

      return exits.success(jsonExport);
    } catch (error) {
      sails.log.error(error);
      return exits.error(error);
    }




  }


};
