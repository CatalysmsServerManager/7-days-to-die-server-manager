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
    }

  },
  exits: {},

  fn: async function (inputs, exits) {

    try {
      const response = await fetch(`https://discord.com/api/${inputs.resource}`, {
        headers: getHeaders(),
        method: inputs.method
      });

      const data = await response.json();

      return exits.success(data);
    } catch (e) {
      return exits.error(e);
    }
  },
};



function getHeaders() {
  return {
    ...getAuth()
  };
}

function getAuth() {
  return { Authorization: `Bot ${process.env.DISCORDBOTTOKEN}` };
}
