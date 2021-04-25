module.exports = {
  inputs: {
  },
  exits: {
    success: {
      responseType: 'view',
      viewTemplatePath: 'sdtdServer/import'
    },

  },


  fn: async function (inputs, exits) {
    exits.success({
      userId: this.req.session.userId
    });
  }


};
