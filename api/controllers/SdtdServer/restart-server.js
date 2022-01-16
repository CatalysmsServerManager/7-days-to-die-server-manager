module.exports = {

  friendlyName: 'Restart server',

  description: 'Restart a server with configurable countdown',

  inputs: {
    serverId: {
      description: 'The ID of the server',
      type: 'number',
      required: true
    },
    delay: {
      description: 'Time to delay (in minutes)',
      type: 'number'
    }
  },

  exits: {
    success: {},
    notFound: {
      description: 'No server with the specified ID was found in the database.',
      responseType: 'notFound'
    }
  },

  /**
   * @memberof SdtdServer
   * @name restart-server
   * @description Restart a server
   * @param {string} serverId  ID of the server
   * @param {number} delay Time to delay the restart (in minutes)
   */

  fn: async function (inputs, exits) {
    sails.log.debug(`API - SdtdServer:restart-server - Restarting server ${inputs.serverId} in ${inputs.delay} minutes`, {serverId: inputs.serverId});

    if (_.isUndefined(inputs.delay)) {
      inputs.delay = 5;
    }

    let server = await SdtdServer.findOne(inputs.serverId);

    setTimeout(() => {
      sails.helpers.sdtdApi.executeConsoleCommand(
        SdtdServer.getAPIConfig(server),
        `shutdown`
      );
    }, inputs.delay * 60 * 1000);



    for (let index = 0; index < inputs.delay + 1; index++) {
      setTimeout(async function () {
        if (inputs.delay - index > 0) {
          await sendXMinutesUntilRestartToServer(inputs.delay - index, server);
        }
      }, index * 60 * 1000);
    }

    return exits.success();
  }
};

/**
 * @memberof SdtdServer#restart-server
 * @param {number} minutesLeft
 * @param {json} server server object with connection data
 * @returns {number} Amount of minutes left after message (eg input - 1)
 */

function sendXMinutesUntilRestartToServer(minutesLeft, server) {
  if (isNaN(minutesLeft)) {
    reject(new Error(`Did not supply a number`));
  }

  return sails.helpers.sdtdApi.executeConsoleCommand(
    SdtdServer.getAPIConfig(server),
    `say "Restarting the server in ${minutesLeft} minute(s)"`
  );
}
