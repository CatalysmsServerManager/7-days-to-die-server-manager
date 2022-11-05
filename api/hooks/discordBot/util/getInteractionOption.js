module.exports = function getInteractionOption(interaction, optionName, defaultTo) {
  const option = interaction.options.data
    .find((option) => option.name === optionName);

  if (!option || !option.value) {
    return defaultTo;
  }

  return option.value;
};
