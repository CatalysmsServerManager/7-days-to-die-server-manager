const replyTypes = require('../../../worker/processors/sdtdCommands/replyTypes');
module.exports = {
  friendlyName: 'Add reply',
  description: '',

  inputs: {
    serverId: {
      type: 'string',
      required: true
    },

    type: {
      type: 'string',
      required: true,
      isIn: replyTypes.map(r => r.type),
    },

    reply: {
      type: 'string',
      required: true
    },

  },


  exits: {

    badRequest: {
      description: '',
      statusCode: 400
    },

  },


  fn: async function (inputs, exits) {

    let result;

    // Check if a reply with the same type already exists

    const alreadyExistingEntry = await CommandReply.find({
      server: inputs.serverId,
      type: inputs.type
    });

    // If a reply for this type is already registered, we will update the existing one

    if (alreadyExistingEntry.length > 0) {
      result = await CommandReply.update({
        server: inputs.serverId,
        type: inputs.type
      }, {
        reply: inputs.reply
      }).fetch();
      result.created = false;
    } else {
      // If this is a new type, create a db entry

      result = await CommandReply.create({
        server: inputs.serverId,
        type: inputs.type,
        reply: inputs.reply
      }).fetch();
      result.created = true;
    }

    return exits.success(result);

  }


};
