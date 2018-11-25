const sevenDays = require('machinepack-7daystodiewebapi');

module.exports = {


  friendlyName: 'Parse cron job',


  description: '',


  inputs: {

    jobId: {
      type: 'number',
      required: true,
      custom: async (valueToCheck) => {
        let foundJob = await CronJob.findOne(valueToCheck);
        return foundJob
      }
    }

  },


  exits: {

  },


  fn: async function (inputs, exits) {


    let functionToExecute = async () => {

      let foundJob = await CronJob.findOne(inputs.jobId).populate('server');

      let commandsToExecute = foundJob.command.split(';');
      let responses = new Array();

      for (const commandToExec of commandsToExecute) {


        if (commandToExec.includes("wait(")) {
          let secondsToWaitStr = commandToExec.replace('wait(', '').replace(')', '');
          let secondsToWait;

          secondsToWait = parseInt(secondsToWaitStr);

          if (isNaN(secondsToWait)) {
            return responses.push(`Invalid wait() syntax! example: wait(5)`);
          }

          await delaySeconds(secondsToWait);
          responses.push(`Waiting ${secondsToWait} seconds`);
        } else {
          let response = await execCmd(foundJob, commandToExec);
          responses.push(response);

        }

      }

      sails.log.debug(`Executed a cron job for server ${foundJob.server.name}`, _.omit(foundJob, 'server'));

      foundJob.responses = responses;

      if (foundJob.notificationEnabled) {
        await sails.hooks.discordnotifications.sendNotification({
          serverId: foundJob.server.id,
          job: foundJob,
          notificationType: "cronjob"
        })
      }


    }


    // All done.
    return exits.success(functionToExecute);

  }


};

async function execCmd(job, command) {
  return new Promise((resolve, reject) => {
    sevenDays.executeCommand({
      ip: job.server.ip,
      port: job.server.webPort,
      authName: job.server.authName,
      authToken: job.server.authToken,
      command: command.trim()
    }).exec({
      success: async (data) => {
        resolve(data)
      },
      error: err => {
        reject(err)
      }
    })
  })
}


function delaySeconds(seconds) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, seconds * 1000)
  });
};
