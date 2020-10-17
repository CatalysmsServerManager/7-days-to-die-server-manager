const fetch = require('node-fetch');

module.exports = {
  friendlyName: 'Execute a discord request',
  inputs: {
    resource: {
      required: true,
      type: 'string'
    },

    method: {
      default: 'get',
      type: 'string',
      isIn: ['get', 'post']
    },

    data: {
      type: 'json'
    }

  },
  exits: {},

  fn: async function (inputs, exits) {
    const url = `https://discord.com/api/${inputs.resource}`;
    sails.log.debug(`HELPER:discordRequest - sending request!`, inputs);

    const response = await fetch(url, {
      headers: getHeaders(),
      method: inputs.method,
      body: JSON.stringify(inputs.data)
    });

    if (response.ok) {
      const data = await response.json();
      return exits.success(data);
    } else {
      sails.log.error(`HELPER:discordRequest - request errored`, response);
      return exits.error(new Error(response.statusText));
    }
  },
};



function getHeaders() {
  return {
    'Content-Type': 'application/json',
    ...getAuth()
  };
}

function getAuth() {
  return { Authorization: `Bot ${process.env.DISCORDBOTTOKEN}` };
}
