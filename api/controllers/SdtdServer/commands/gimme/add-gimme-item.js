module.exports = {

  friendlyName: 'Add gimme item',

  description: 'Adds a new entry for a server for gimme.',

  inputs: {
    serverId: {
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
      server: inputs.serverId
    };

    if (inputs.friendlyName) {
      databaseObject.friendlyName = inputs.friendlyName;
    } else {
      databaseObject.friendlyName = inputs.value;
    }

    let createdItem = await GimmeItem.create(databaseObject).fetch();
    sails.log.info(`Added a new gimme items for server ${inputs.server} - ${JSON.stringify(createdItem)}`)
    return exits.success(createdItem);

  }
};
