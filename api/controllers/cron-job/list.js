module.exports = {


    friendlyName: 'List',
  
  
    description: 'List cron jobs for a server.',
  
  
    inputs: {
  
      serverId: {
        required: true,
        type: 'number',
        custom: async function(valueToCheck) {
          let foundServer = await SdtdServer.findOne(valueToCheck);
          return foundServer 
        }
      },
  
    },
  
  
    exits: {
  
    },
  
  
    fn: async function (inputs, exits) {
  
        let foundJobs = await CronJob.find({server: inputs.serverId});
  
      return exits.success(foundJobs);
  
    }
  
  
  };
  