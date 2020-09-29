'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const {DataTypes} = Sequelize;
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.changeColumn('gblcomment', 'content', {
        type: DataTypes.TEXT,
        allowNull: true
      });
      await queryInterface.changeColumn('sdtdconfig', 'votingCommand', {
        type: DataTypes.TEXT,
        allowNull: true
      });
      await queryInterface.changeColumn('customcommand', 'commandsToExecute', {
        type: DataTypes.TEXT + ' CHARACTER SET utf8mb4',
        allowNull: true
      });
      await queryInterface.changeColumn('customhook', 'commandsToExecute', {
        type: DataTypes.TEXT + ' CHARACTER SET utf8mb4',
        allowNull: true
      });
      await queryInterface.changeColumn('cronjob', 'command', {
        type: DataTypes.TEXT,
        allowNull: true
      });
      await queryInterface.changeColumn('banentry', 'reason', {
        type: DataTypes.TEXT,
        allowNull: true
      });
      await queryInterface.changeColumn('banentry', 'note', {
        type: DataTypes.TEXT,
        allowNull: true
      });
      await queryInterface.changeColumn('customhook', 'cooldown', {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      });
      await queryInterface.changeColumn('role', 'immuneToBannedItemsList', {
        type: DataTypes.TINYINT(1),
        allowNull: true,
        defaultValue: 0
      });

      await queryInterface.addIndex(
        'sdtdconfig',
        {
          name: 'IDX_sdtdconfig_server',
          unique: true,
          fields: ['server']
        }
      );
      await queryInterface.addIndex(
        'historicalinfo',
        {
          name: 'IDX_historicalinfo_createdAt',
          unique: false,
          fields: ['createdAt']
        }
      );
      await queryInterface.addIndex(
        'historicalinfo',
        {
          fields: ['type']
        }
      );
      await queryInterface.addIndex(
        'player',
        {
          name: 'IDX_player_steamId_server',
          unique: true,
          fields: ['steamId', 'server']
        }
      );
      await queryInterface.addIndex(
        'player',
        {
          fields: ['server']
        }
      );
      await queryInterface.addIndex(
        'analytics',
        {
          name: 'IDX_analytics_createdAt_server',
          unique: false,
          fields: ['createdAt', 'server']
        }
      );
      await queryInterface.addIndex(
        'customdiscordnotification',
        {
          name: 'IDX_customdiscordnotification_server',
          unique: false,
          fields: ['server']
        }
      );
      await queryInterface.addIndex(
        'trackinginfo',
        {
          unique: false,
          fields: ['createdAt']
        }
      );
      await queryInterface.addIndex(
        'trackinginfo',
        {
          unique: false,
          fields: ['server']
        }
      );

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
  down: async (queryInterface, Sequelize) => {
  }
};

