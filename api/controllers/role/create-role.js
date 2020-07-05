module.exports = {


  friendlyName: 'Create role',


  description: '',


  inputs: {

    name: {
      type: 'string',
      required: true
    },

    level: {
      type: 'number',
      required: true,
      min: 0,
      max: 9999,
    },

    serverId: {
      type: 'number',
      required: true,
      custom: async (valueToCheck) => {
        let foundServer = await SdtdServer.findOne(valueToCheck);
        return foundServer;
      },
    }

  },


  exits: {

  },


  fn: async function (inputs, exits) {

    let server = await SdtdServer.findOne(inputs.serverId);

    let createdRole = await Role.create({
      name: inputs.name,
      level: inputs.level,
      server: inputs.serverId
    }).fetch();

    sails.log.info(`Created a role with name ${inputs.name} and level ${inputs.level} for server ${server.name}`);

    return exits.success(createdRole);

  }


};
