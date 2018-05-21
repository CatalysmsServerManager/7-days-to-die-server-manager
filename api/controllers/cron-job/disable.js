module.exports = {


  friendlyName: 'Disable',


  description: 'Disable cron job.',


  inputs: {

  },


  exits: {

  },


  fn: async function (inputs, exits) {

    return exits.success();

  }


};
