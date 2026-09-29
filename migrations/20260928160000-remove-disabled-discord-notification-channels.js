"use strict";

// Selecting "Disabled" for a Discord notification used to store '0' as the channel id,
// which the notification worker treated as a real channel.
module.exports = {
  async up(queryInterface) {
    const [configs] = await queryInterface.sequelize.query(
      "SELECT id, discordNotificationConfig FROM sdtdconfig WHERE discordNotificationConfig IS NOT NULL"
    );

    for (const config of configs) {
      const notificationConfig = JSON.parse(config.discordNotificationConfig);
      const disabledTypes = Object.keys(notificationConfig).filter(
        (type) => String(notificationConfig[type]) === "0"
      );

      if (!disabledTypes.length) {
        continue;
      }

      for (const type of disabledTypes) {
        delete notificationConfig[type];
      }

      await queryInterface.sequelize.query(
        "UPDATE sdtdconfig SET discordNotificationConfig = ? WHERE id = ?",
        { replacements: [JSON.stringify(notificationConfig), config.id] }
      );
    }
  },

  async down() {},
};
