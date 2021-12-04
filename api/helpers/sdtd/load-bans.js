const countryBanRegex = new RegExp('^(CSMM: Players from your country )(\(.*\))( are not allowed to connect to this server)');

module.exports = {


  friendlyName: 'Load bans',


  description: 'Loads the bans of a server and store them in DB',


  inputs: {

    serverId: {
      type: 'number',
      description: 'Id of the server',
      required: true
    }

  },


  exits: {
    success: {
      outputFriendlyName: 'Success',
      outputType: 'boolean'
    },
    notAvailable: {
      outputFriendlyName: 'Not available',
      description: 'The server could not be reached'
    }
  },


  fn: async function (inputs, exits) {
    const dateStarted = new Date();
    const server = await SdtdServer.findOne(inputs.serverId);

    const response = await sails.helpers.sdtdApi.executeConsoleCommand(
      SdtdServer.getAPIConfig(server),
      `ban list`
    );


    if (!response) {
      return exits.error();
    }

    let result = response.result;

    let banRows = result.split('\n');
    banRows = _.drop(banRows, 2);
    banRows = _.dropRight(banRows, 1);

    let updatedServerBansInDB = new Array();
    let currentBansInDB = await BanEntry.find({
      server: inputs.serverId
    });

    for (const ban of banRows) {
      let splitBan = _.split(ban, ' - ');
      let bannedUntil = new Date(splitBan[0]);
      let steamId = splitBan[1];
      let banReason = _.join(_.drop(splitBan, 2), ' ');

      // Ignore bans made by the country ban module
      if (!countryBanRegex.test(banReason)) {
        let foundBanRecord = await BanEntry.findOrCreate({
          server: inputs.serverId,
          steamId: steamId
        }, {
          server: inputs.serverId,
          steamId: steamId,
          bannedUntil: bannedUntil.valueOf(),
          reason: banReason
        });

        let updatedEntry = await BanEntry.update({
          id: foundBanRecord.id
        }, {
          bannedUntil: bannedUntil.valueOf(),
          reason: banReason,
          unbanned: false
        }).fetch();

        updatedServerBansInDB.push(updatedEntry[0]);
        sails.log.verbose(`Handled a ban for ${sdtdServer.name} - ${foundBanRecord.steamId} until ${bannedUntil.toString()} because "${banReason}"`, {serverId: inputs.serverId});
      }
    }

    updatedServerBansInDB = updatedServerBansInDB.map(value => value.id);
    currentBansInDB = currentBansInDB.map(value => value.id);

    let bansInDBnotOnServer = currentBansInDB.filter(banEntry => {
      return updatedServerBansInDB.indexOf(banEntry) === -1;
    });

    if (bansInDBnotOnServer.length > 0) {
      let unBannedRecords = await BanEntry.update({
        id: bansInDBnotOnServer
      }, {
        unbanned: true
      }).fetch();
      sails.log.debug(`Detected unban of ${unBannedRecords.length} player${unBannedRecords.length === 1 ? '' : 's'} on server ${sdtdServer.name}`, {serverId: inputs.serverId});
    }


    let dateEnded = new Date();
    sails.log.info(`Updated a servers entries in GBL - ${sdtdServer.name} - ${updatedServerBansInDB.length} total bans - Took ${dateEnded.valueOf() - dateStarted.valueOf()} ms`, {serverId: inputs.serverId});
    return exits.success(updatedServerBansInDB);

  }
};
