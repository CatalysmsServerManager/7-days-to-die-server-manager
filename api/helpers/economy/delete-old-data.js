module.exports = {


  friendlyName: 'Delete old data',


  description: 'Delete old economy data',


  inputs: {

    serverId: {
      type: 'number',
      description: 'Id of the server',
      required: true
    },

  },


  exits: {
    success: {
      outputFriendlyName: 'Success',
    },
  },

  fn: async function (inputs, exits) {

    let actionsCompleted = await sails.helpers.redis.get(`server:${inputs.serverId}:economyActionsCompleted`);
    sails.log.verbose(`Server ${inputs.serverId} has completed ${actionsCompleted} economy actions - checking if these need to be deleted.`, {serverId: inputs.serverId});
    if (actionsCompleted && actionsCompleted > sails.config.custom.economyActionsBeforeDelete) {
      await sails.helpers.redis.set(`server:${inputs.serverId}:economyActionsCompleted`, 1);
      let donatorRole = await sails.helpers.meta.checkDonatorStatus.with({
        serverId: inputs.serverId
      });
      let hoursToKeepData = sails.config.custom.donorConfig[donatorRole].economyKeepDataHours;
      let milisecondsToKeepData = hoursToKeepData * 3600000;
      let dateNow = Date.now();
      let borderDate = new Date(dateNow.valueOf() - milisecondsToKeepData);

      await HistoricalInfo.destroy({
        createdAt: {
          '<': borderDate.valueOf()
        },
        type: 'economy',
        server: inputs.serverId
      });
      sails.log.debug(`Deleted old historical info for server ${inputs.serverId}`, {serverId: inputs.serverId});
    }
    return exits.success();

  }
};
