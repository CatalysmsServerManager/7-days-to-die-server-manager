'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const {DataTypes} = Sequelize;
    const transaction = await queryInterface.sequelize.transaction();
    try {
      const boolFields = [
        ['banentry', 'unbanned', 0],
        ['customcommandargument','required', 1],
        ['customdiscordnotification','ignoreServerChat',1],
        ['sdtdconfig', 'chatChannelGlobalOnly', 0],
        ['sdtdconfig', 'pingKickEnabled', 0],
        ['sdtdconfig', 'votingEnabled', 0],
        ['sdtdconfig', 'enabledGimme', 0],
        ['sdtdconfig', 'enabledWho', 1],
        ['sdtdconfig', 'inactive', 0],
      ];

      for (const [table, column, value] of boolFields) {
        queryInterface.changeColumn(table, column, {
          type: DataTypes.TINYINT(1),
          allowNull: false,
          defaultValue: value
        });
      }
      await queryInterface.changeColumn('banentry', 'unbanned', {
        type: DataTypes.TINYINT(1),
        allowNull: true,
        defaultValue: 0
      });

      await queryInterface.changeColumn('customhook', 'cooldown', {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      });
      await queryInterface.changeColumn('customhook', 'regex', {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: ''
      });
      await queryInterface.changeColumn('customhook', 'searchString', {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: ''
      });

      await queryInterface.changeColumn('customcommandargument', 'allowedValues', {
        type: 'LONGTEXT',
        allowNull: true
      });

      await queryInterface.changeColumn('historicalinfo', 'economyAction', {
        type: DataTypes.TEXT,
      });
      await queryInterface.changeColumn('historicalinfo', 'message', {
        type: DataTypes.TEXT,
      });

      await queryInterface.changeColumn('sdtdconfig', 'gimmeCooldown', {
        type: DataTypes.DOUBLE,
        defaultValue: 30,
      });
      await queryInterface.changeColumn('sdtdconfig', 'maxPing', {
        type: DataTypes.DOUBLE,
        defaultValue: 30,
      });
      await queryInterface.changeColumn('sdtdconfig', 'pingChecksToFail', {
        type: DataTypes.DOUBLE,
        defaultValue: 3,
      });
      await queryInterface.changeColumn('sdtdconfig', 'bannedItemsCommand', {
        type: DataTypes.TEXT,
        allowNull: true
      });
      await queryInterface.changeColumn('sdtdconfig', 'pingKickMessage', {
        type: DataTypes.STRING(255),
        defaultValue: 'Your ping is too high! Please check your connection',
      });
      await queryInterface.changeColumn('sdtdconfig', 'votingApiKey', {
        type: DataTypes.STRING(255),
        defaultValue: '',
      });

      await queryInterface.changeColumn('sdtdticket', 'title', {
        type: DataTypes.TEXT,
        allowNull: true
      });

      await queryInterface.changeColumn('customcommand', 'description', {
        type: DataTypes.TEXT,
        allowNull: true
      });

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
  down: async (queryInterface, Sequelize) => {
  }
};
