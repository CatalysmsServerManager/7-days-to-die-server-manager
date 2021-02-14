const commands = require('./commands');
const CustomCommand = require('./customCommand');

module.exports = async function findCommandToExecute(commandName, server) {
  if (commands.has(commandName)) {
    const commandToRun = commands.get(commandName);
    return commandToRun;
  }

  let aliasFound = false;

  commands.forEach((command) => {
    let idx = _.findIndex(command.aliases, (alias => commandName === alias));
    if (idx !== -1) {
      aliasFound = command;
    }
  });

  if (aliasFound) {
    return aliasFound;
  }

  let customCommands = await sails.models.customcommand.find({
    server: server.id,
    enabled: true,
    name: commandName
  }).populate('arguments');

  let customCommandFound = false;

  customCommands.forEach(command => {
    customCommandFound = new CustomCommand(server.id, command);
  });

  if (customCommandFound) {
    return customCommandFound;
  }

  return undefined;
};
