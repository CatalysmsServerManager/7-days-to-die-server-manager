'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const {DataTypes} = Sequelize;
    const transaction = await queryInterface.sequelize.transaction();
    try {
      const tableNames = [
        // grep createTable migrations/20200905210049-init.js -A 1 | grep ,
        'user',
        'sdtdserver',
        'analytics',
        'banentry',
        'commandreply',
        'countryban',
        'cronjob',
        'customcommand',
        'customcommandargument',
        'customdiscordnotification',
        'customhook',
        'gblcomment_heartedBy__user_heartedGblComment',
        'gblcomment',
        'gimmeitem',
        'historicalinfo',
        'hookvariable',
        'player',
        'playerclaimitem',
        'playerteleport',
        'playerusedcommand',
        'playerusedgimme',
        'role',
        'sdtdconfig',
        'sdtdserver_admins__user_adminOf',
        'sdtdserver',
        'sdtdticket',
        'shoplisting',
        'ticketcomment',
        'trackinginfo',
        'usagestats',
        'user',
        'archive',
      ];
      for (const tableName of tableNames) {
        await queryInterface.sequelize.query(`ALTER TABLE ${tableName} CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`)
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


