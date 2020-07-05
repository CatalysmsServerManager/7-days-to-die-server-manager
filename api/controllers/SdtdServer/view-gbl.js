module.exports = {


  friendlyName: 'Get global ban list view',


  inputs: {

  },


  exits: {
    success: {
      responseType: 'view',
      viewTemplatePath: 'sdtdServer/global-ban-list'
    }

  },


  fn: async function (inputs, exits) {
    exits.success();
  }


};
