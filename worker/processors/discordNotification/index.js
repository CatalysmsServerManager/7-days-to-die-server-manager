const notifications = require('./notifications');


module.exports = async function discordNotification(job) {
  sails.log.debug('[Worker] Got a `discordNotification` job', {serverId: job.data.serverId});
  if (!job.data.serverId) {
    throw new Error(`Must specify a serverId in options to send notification`);
  }
  if (!job.data.notificationType) {
    throw new Error(`Must specify a notificationType in options`);
  }
  let serverConfig = await SdtdConfig.findOne({ server: job.data.serverId });

  if (serverConfig.discordNotificationConfig[job.data.notificationType]) {
    let notificationClass = getNotificationClass(job.data.notificationType);

    if (!notificationClass) {
      throw new Error(`Unknown notification type: ${job.data.notificationType}`);
    }


    return notificationClass.sendNotification(job.data);
  }
};

function getNotificationClass(notificationName) {
  return notifications.find(notif => notif.name.toLowerCase() === notificationName.toLowerCase());
}
