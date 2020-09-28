'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const {DataTypes} = Sequelize;
    const transaction = await queryInterface.sequelize.transaction();
    try {
      queryInterface.changeColumn('gblcomment', 'content', {
        type: DataTypes.TEXT,
        allowNull: true
      });
      queryInterface.changeColumn('sdtdconfig', 'votingCommand', {
        type: DataTypes.TEXT,
        allowNull: true
      });
      queryInterface.changeColumn('customcommand', 'commandsToExecute', {
        type: DataTypes.TEXT + ' CHARACTER SET utf8mb4',
        allowNull: true
      });
      queryInterface.changeColumn('customhook', 'commandsToExecute', {
        type: DataTypes.TEXT + ' CHARACTER SET utf8mb4',
        allowNull: true
      });
      queryInterface.changeColumn('cronjob', 'command', {
        type: DataTypes.TEXT,
        allowNull: true
      });
      queryInterface.changeColumn('banentry', 'reason', {
        type: DataTypes.TEXT,
        allowNull: true
      });
      queryInterface.changeColumn('banentry', 'note', {
        type: DataTypes.TEXT,
        allowNull: true
      });
      queryInterface.changeColumn('customhook', 'cooldown', {
        type: DataTypes.DOUBLE,
        allowNull: true,
        default: 0
      });
      queryInterface.changeColumn('role', 'immuneToBannedItemsList', {
        type: DataTypes.TINYINT(1),
        allowNull: true,
        default: 0
      });

      queryInterface.addIndex(
        'sdtdconfig',
        {
          name: 'IDX_sdtdconfig_server',
          unique: true,
          fields: ['server']
        }
      );
      queryInterface.addIndex(
        'historicalinfo',
        {
          name: 'IDX_historicalinfo_createdAt',
          unique: false,
          fields: ['createdAt']
        }
      );
      queryInterface.addIndex(
        'historicalinfo',
        {
          fields: ['type']
        }
      );
      queryInterface.addIndex(
        'player',
        {
          name: 'IDX_player_steamId_server',
          unique: true,
          fields: ['steamId', 'server']
        }
      );
      queryInterface.addIndex(
        'player',
        {
          fields: ['server']
        }
      );
      queryInterface.addIndex(
        'analytics',
        {
          name: 'IDX_analytics_createdAt_server',
          unique: false,
          fields: ['createdAt', 'server']
        }
      );
      queryInterface.addIndex(
        'customdiscordnotification',
        {
          name: 'IDX_customdiscordnotification_server',
          unique: false,
          fields: ['server']
        }
      );
      queryInterface.addIndex(
        'trackinginfo',
        {
          unique: false,
          fields: ['createdAt']
        }
      );
      queryInterface.addIndex(
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

