module.exports = {


  friendlyName: 'Get system stats',


  description: '',


  inputs: {

  },


  exits: {

  },


  fn: async function (inputs, exits) {

    let stats = await sails.helpers.meta.loadSystemStatsAndInfo(); 

    return exits.success(stats);

  }


};
