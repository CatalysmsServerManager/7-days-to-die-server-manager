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
      type: 'ref'
    }

  },
  exits: {},

  fn: async function (inputs, exits) {
    const response = await fetch(`https://discord.com/api/${inputs.resource}`, {
      headers: getHeaders(),
      method: inputs.method,
      body: JSON.stringify(inputs.data)
    });

    if (response.ok) {
      const data = await response.json();
      return exits.success(data);
    } else {
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
