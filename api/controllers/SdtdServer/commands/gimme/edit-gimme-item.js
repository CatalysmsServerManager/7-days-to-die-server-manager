module.exports = {

  friendlyName: 'Edits gimme item',

  description: 'Edit an entry for a server for gimme.',

  inputs: {
    gimmeId: {
      type: 'number',
      required: true
    },

    type: {
      type: 'string',
      isIn: ["item", "command", "entity"],
      required: true
    },

    value: {
      type: 'string',
      minLength: 1,
      required: true
    },

    friendlyName: {
      type: 'string',
      minLength: 1,
      maxLength: 100
    }
  },

  exits: {
    success: {},
  },


  fn: async function (inputs, exits) {

    let databaseObject = {
      type: inputs.type,
      friendlyName: undefined,
      value: inputs.value,
    };

    if (inputs.friendlyName) {
      databaseObject.friendlyName = inputs.friendlyName;
    } else {
      databaseObject.friendlyName = inputs.value;
    }

    let updatedItem = await GimmeItem.update({id: inputs.gimmeId}, databaseObject).fetch();
    sails.log.info(`Edited a gimme item with id ${inputs.gimmeId} - ${JSON.stringify(updatedItem)}`);
    return exits.success(updatedItem);

  }
};
