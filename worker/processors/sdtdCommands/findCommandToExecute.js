module.exports = async function findCommandToExecute(commandName) {
  if (this.commands.has(commandName)) {
    let commandToRun = this.commands.get(commandName);
    return commandToRun;
  }

  let aliasFound = false;

  this.commands.forEach((command) => {
    let idx = _.findIndex(command.aliases, (alias => commandName === alias));
    if (idx !== -1) {
      aliasFound = command;
    }
  });

  if (aliasFound) {
    return aliasFound;
  }

  let customCommands = await sails.models.customcommand.find({
    server: this.serverId,
    enabled: true,
    name: commandName
  }).populate('arguments');

  let customCommandFound = false;

  customCommands.forEach(command => {
    customCommandFound = new CustomCommand(this.serverId, command);
  });

  if (customCommandFound) {
    return customCommandFound;
  }

  return undefined;
};
