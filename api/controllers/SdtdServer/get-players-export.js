const { AsyncParser } = require('json2csv');

module.exports = {
  inputs: {
    serverId: {
      required: true,
      type: 'number'
    }
  },

  exits: {},

  fn: async function (inputs, exits) {
    this.res.setHeader('Content-type', 'text/csv');

    const fields = Player.attributes;

    const fieldsWithAssociations = [];

    for (const fieldKey in fields) {
      if (Object.hasOwnProperty.call(fields, fieldKey)) {
        fieldsWithAssociations.push(fieldKey);
      }
    }
    const opts = { fields: fieldsWithAssociations };

    asyncParser = new AsyncParser(opts);

    asyncParser.processor
      //.on('data', chunk => {csv += chunk.toString();})
      .on('end', () => this.res.end())
      .on('error', err => exits.error(err))
      .pipe(this.res);


    await Player.stream({server: inputs.serverId})
      .meta({enableExperimentalDeepTargets:true})
      .populate('role')
      .eachRecord(async (player)=>{
        if (player.role) {player.role = player.role.name;}

        asyncParser.input.push(JSON.stringify(player));
      });




    // Sending `null` to a stream signal that no more data is expected and ends it.
    asyncParser.input.push(null);
  }
};
