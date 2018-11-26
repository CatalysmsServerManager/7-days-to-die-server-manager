module.exports = {

  friendlyName: 'Delete gimme item',

  description: 'Deletes an entry for a server for gimme.',

  inputs: {
    itemId: {
      type: 'number',
      required: true
    },
  },

  exits: {
    success: {},
  },


  fn: async function (inputs, exits) {

    await GimmeItem.destroy({
      id: inputs.itemId
    });
    sails.log.info(`Deleted a gimme item with id ${inputs.itemId}`);
    return exits.success();

  }
};
