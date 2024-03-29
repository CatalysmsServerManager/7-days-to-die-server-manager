module.exports = {

  friendlyName: 'Create command',

  description: '',

  inputs: {
    serverId: {
      type: 'number',
      required: true
    },

    commandsToExecute: {
      type: 'ref',
      required: true
    },

    commandName: {
      type: 'string',
      required: true,
      maxLength: 25
    }
  },

  exits: {
    success: {},
    brokenDonator: {
      responseType: 'badRequest'
    },
    badCommand: {
      responseType: 'badRequest'
    },

    badName: {
      responseType: 'badRequest'
    },

    maxCommands: {
      description: 'User has added max amount of commands already',
      responseType: 'badRequest',
      statusCode: 400
    }

  },


  fn: async function (inputs, exits) {

    try {
      let server = await SdtdServer.findOne(inputs.serverId);
      let donatorRole = await sails.helpers.meta.checkDonatorStatus.with({
        serverId: server.id
      });
      let amountOfExistingCommands = await CustomCommand.count({
        server: server.id
      });
      if (!sails.config.custom.donorConfig[donatorRole]) {
        const err = new Error(`Donator status of ${donatorRole} is unmanaged, contact an admin`);
        sails.log.error(err, {server});
        return exists.brokenDonator(err.message);
      }
      let maxCustomCommands = sails.config.custom.donorConfig[donatorRole].maxCustomCommands;

      if (amountOfExistingCommands >= maxCustomCommands) {
        return exits.maxCommands('You have set the maximum amount of commands for this server already. Consider deleting some, or donating :)');
      }


      if (inputs.commandName.includes(' ')) {
        return exits.badName('Name cannot have spaces');
      }

      let commandsWithSameName = await CustomCommand.find({
        name: inputs.commandName,
        server: inputs.serverId
      });

      if (commandsWithSameName.length > 0) {
        return exits.badName('Invalid name! Please choose another one.');
      }


      let createdCommand = await CustomCommand.create({
        name: inputs.commandName,
        commandsToExecute: inputs.commandsToExecute,
        server: inputs.serverId
      }).fetch();

      sails.log.info(`Created a custom command`, {createdCommand, server});
      return exits.success(createdCommand);



    } catch (error) {
      sails.log.error(`${error}`, {serverId: inputs.serverId});
      return exits.error(error);
    }


  }
};
