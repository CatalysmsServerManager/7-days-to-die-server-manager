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

    await CustomHook.destroy({
      id: inputs.hookId
    });
    return exits.success();

  }


};
