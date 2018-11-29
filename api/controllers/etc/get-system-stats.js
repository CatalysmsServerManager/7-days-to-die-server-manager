module.exports = {


  friendlyName: 'Get system stats',


  description: '',


  inputs: {
    since: {
      type: 'number',
      isBefore: new Date(),
      defaultsTo: Date.now() - 4233600000 // 1 month ago
    }
  },


  exits: {

  },


  fn: async function (inputs, exits) {


    let stats = await UsageStats.find({
      where: {
        createdAt: {
          '>': inputs.since
        }
      }
    });
    sails.log.info(`Loaded ${stats.length} records of CSMM usage stats`);
    return exits.success(stats);

  }


};
