'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const thingstoremove = [
      ['sdtdconfig', 'daysToKeepData'],
      ['sdtdconfig', 'discordCommandsChannelId'],
      ['sdtdconfig', 'enabledCommands'],
      ['sdtdconfig', 'motdEnabled'],
      ['sdtdconfig', 'motdInterval'],
      ['sdtdconfig', 'motdMessage'],
      ['sdtdconfig', 'motdOnJoinEnabled'],
      ['sdtdconfig', 'notificationChannelId'],

      ['sdtdserver', 'gamePort'],
      ['sdtdserver', 'telnetPort'],

      ['usagestats', 'motdHandlers'],

      ['historicalinfo', 'description'],

      ['sdtdticket', 'commentText'],
    ];

    const transaction = await queryInterface.sequelize.transaction();
    try {
      for (const [table, column] of thingstoremove) {
        const tableInfo = await queryInterface.describeTable(table);
        if (tableInfo[column]) {
          await queryInterface.removeColumn(table, column)
        }
      }
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
  down: async (queryInterface, Sequelize) => {
  }
};
