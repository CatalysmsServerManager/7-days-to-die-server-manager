module.exports = {

  friendlyName: 'Edit argument',

  description: '',

  inputs: {
    argumentId: {
      type: 'number',
      required: true
    },

    key: {
      type: 'string',
      required: true
    },

    type: {
      type: 'string',
      isIn: ['number', 'text', 'setValues'],
      required: true
    },

    required: {
      type: 'boolean'
    },

    default: {
      type: 'string'
    },

  },

  exits: {
    success: {},
    badCommand: {
      responseType: 'badRequest'
    },

    badName: {
      responseType: 'badRequest'
    },

  },


  fn: async function (inputs, exits) {

    inputs.key = _.toLower(inputs.key);

    let existingArg = await CustomCommandArgument.find({
      where: {
        key: inputs.key,
        command: inputs.commandId,
        id: { '!=': inputs.argumentId }
      }
    });

    if (existingArg.length > 0) {
      return exits.badName('An argument with this key already belongs to this command.');
    }

    if (inputs.key === 'steamid' || inputs.key === 'entityid') {
      return exits.badCommand('You cannot use reserved names for argument names.');
    }

    if (!inputs.required && _.isUndefined(inputs.default)) {
      return exits.badCommand('If an argument is not required, you must provide a default value.');
    }

    await CustomCommandArgument.update(
      {
        id: inputs.argumentId
      }, {
        key: inputs.key,
        type: inputs.type,
        required: inputs.required,
        defaultValue: inputs.default,
        command: inputs.commandId
      }
    );

    return exits.success();

  }
};


