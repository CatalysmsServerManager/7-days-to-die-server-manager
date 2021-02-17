const commands = require('./commands');
const CustomCommand = require('./customCommand');

module.exports = async function findCommandToExecute(commandName, server) {
  commandName = commandName.toLowerCase();
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

  const command = await sails.models.customcommand.findOne({
    server: server.id,
    enabled: true,
    name: commandName
  }).populate('arguments');

  if (command) {
    return new CustomCommand(command);
  }

  return undefined;
};
