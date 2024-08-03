const hooksCache = require('../../../api/hooksCache');

module.exports = {


  friendlyName: 'Delete hook',


  description: 'Delete a custom hook.',


  inputs: {

    hookId: {
      required: true,
      type: 'string',
    },



  },


  exits: {

  },


  fn: async function (inputs, exits) {
    const hookToDelete = await CustomHook.findOne({
      id: inputs.hookId
    });

    await CustomHook.destroy({
      id: inputs.hookId
    });
    await hooksCache.reset(hookToDelete.server);
    return exits.success();

  }


};
