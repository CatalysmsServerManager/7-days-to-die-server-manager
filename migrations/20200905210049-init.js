'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.createTable(
      'user',
      {
        createdAt: {
          type: Sequelize.DataTypes.BIGINT,
          allowNull: true
        },
        updatedAt: {
          type: Sequelize.DataTypes.BIGINT,
          allowNull: true
        },
        id: {
          autoIncrement: true,
          type: Sequelize.DataTypes.INTEGER(11),
          allowNull: false,
          primaryKey: true
        },
        steamId: {
          type: Sequelize.DataTypes.STRING(255),
          allowNull: true,
          unique: true
        },
        discordId: {
          type: Sequelize.DataTypes.STRING(255),
          allowNull: true
        },
        username: {
          type: Sequelize.DataTypes.STRING(255),
          allowNull: true
        },
        avatar: {
          type: Sequelize.DataTypes.STRING(255),
          allowNull: true
        },
        admin: {
          type: Sequelize.DataTypes.INTEGER(1),
          allowNull: true
        },
        banned: {
          type: Sequelize.DataTypes.INTEGER(1),
          allowNull: true
        }
      },
      {
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci'
      }
    );

    queryInterface.createTable(
      'sdtdserver',
      {
        createdAt: {
          type: DataTypes.BIGINT,
          allowNull: true
        },
        updatedAt: {
          type: DataTypes.BIGINT,
          allowNull: true
        },
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER(11),
          allowNull: false,
          primaryKey: true
        },
        name: {
          type: DataTypes.STRING(255),
          allowNull: true
        },
        ip: {
          type: DataTypes.STRING(255),
          allowNull: true
        },
        webPort: {
          type: DataTypes.DOUBLE,
          allowNull: true
        },
        authName: {
          type: DataTypes.STRING(255),
          allowNull: true
        },
        authToken: {
          type: DataTypes.STRING(255),
          allowNull: true
        },
        owner: {
          type: DataTypes.INTEGER(11),
          allowNull: true
        }
      },
      {
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci'
      }
    );

    queryInterface.createTable(
      'analytics',
      {
        createdAt: {
          type: DataTypes.BIGINT,
          allowNull: true
        },
        updatedAt: {
          type: DataTypes.BIGINT,
          allowNull: true
        },
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER(11),
          allowNull: false,
          primaryKey: true
        },
        fps: {
          type: DataTypes.DOUBLE,
          allowNull: true
        },
        heap: {
          type: DataTypes.DOUBLE,
          allowNull: true
        },
        chunks: {
          type: DataTypes.DOUBLE,
          allowNull: true
        },
        zombies: {
          type: DataTypes.DOUBLE,
          allowNull: true
        },
        entities: {
          type: DataTypes.DOUBLE,
          allowNull: true
        },
        players: {
          type: DataTypes.DOUBLE,
          allowNull: true
        },
        items: {
          type: DataTypes.DOUBLE,
          allowNull: true
        },
        rss: {
          type: DataTypes.DOUBLE,
          allowNull: true
        },
        uptime: {
          type: DataTypes.DOUBLE,
          allowNull: true
        },
        server: {
          type: DataTypes.INTEGER(11),
          allowNull: true
        }
      },
      {
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci'
      }
    );


    queryInterface.createTable(
      'banentry',
      {
        createdAt: {
          type: DataTypes.BIGINT,
          allowNull: true
        },
        updatedAt: {
          type: DataTypes.BIGINT,
          allowNull: true
        },
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER(11),
          allowNull: false,
          primaryKey: true
        },
        steamId: {
          type: DataTypes.STRING(255),
          allowNull: true
        },
        note: {
          type: DataTypes.STRING(255),
          allowNull: true
        },
        bannedUntil: {
          type: DataTypes.DOUBLE,
          allowNull: true
        },
        reason: {
          type: DataTypes.STRING(255),
          allowNull: true
        },
        unbanned: {
          type: DataTypes.INTEGER(1),
          allowNull: true
        },
        server: {
          type: DataTypes.INTEGER(11),
          allowNull: true
        }
      },
      {
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci'
      }
    );


    queryInterface.createTable(
      'commandreply',
      {
        createdAt: {
          type: DataTypes.BIGINT,
          allowNull: true
        },
        updatedAt: {
          type: DataTypes.BIGINT,
          allowNull: true
        },
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER(11),
          allowNull: false,
          primaryKey: true
        },
        type: {
          type: DataTypes.STRING(255),
          allowNull: true
        },
        reply: {
          type: DataTypes.STRING(255),
          allowNull: true
        },
        server: {
          type: DataTypes.INTEGER(11),
          allowNull: true
        }
      },
      {
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci'
      }
    );

    queryInterface.createTable(
      'countryban',
      {
        createdAt: {
          type: DataTypes.BIGINT,
          allowNull: true
        },
        updatedAt: {
          type: DataTypes.BIGINT,
          allowNull: true
        },
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER(11),
          allowNull: false,
          primaryKey: true
        },
        steamId: {
          type: DataTypes.STRING(255),
          allowNull: true
        },
        country: {
          type: DataTypes.STRING(255),
          allowNull: true
        },
        ip: {
          type: DataTypes.STRING(255),
          allowNull: true
        },
        type: {
          type: DataTypes.STRING(255),
          allowNull: true
        },
        server: {
          type: DataTypes.INTEGER(11),
          allowNull: true
        },
        player: {
          type: DataTypes.INTEGER(11),
          allowNull: true
        }
      },
      {
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci'
      }
    );


    queryInterface.createTable(
      'cronjob',
      {
        createdAt: {
          type: DataTypes.BIGINT,
          allowNull: true
        },
        updatedAt: {
          type: DataTypes.BIGINT,
          allowNull: true
        },
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER(11),
          allowNull: false,
          primaryKey: true
        },
        command: {
          type: DataTypes.STRING(255),
          allowNull: true
        },
        temporalValue: {
          type: DataTypes.STRING(255),
          allowNull: true
        },
        enabled: {
          type: DataTypes.INTEGER(1),
          allowNull: true
        },
        notificationEnabled: {
          type: DataTypes.INTEGER(1),
          allowNull: true
        },
        server: {
          type: DataTypes.INTEGER(11),
          allowNull: true
        }
      },
      {
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci'
      }
    );


    queryInterface.createTable(
      'customcommand',
      {
        createdAt: {
          type: DataTypes.BIGINT,
          allowNull: true
        },
        updatedAt: {
          type: DataTypes.BIGINT,
          allowNull: true
        },
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER(11),
          allowNull: false,
          primaryKey: true
        },
        costToExecute: {
          type: DataTypes.DOUBLE,
          allowNull: true
        },
        name: {
          type: DataTypes.STRING(255),
          allowNull: true
        },
        description: {
          type: DataTypes.STRING(255),
          allowNull: true
        },
        aliases: {
          type: DataTypes.STRING(255),
          allowNull: true
        },
        commandsToExecute: {
          type: DataTypes.TEXT,
          allowNull: true
        },
        enabled: {
          type: DataTypes.INTEGER(1),
          allowNull: true
        },
        delay: {
          type: DataTypes.DOUBLE,
          allowNull: true
        },
        timeout: {
          type: DataTypes.DOUBLE,
          allowNull: true
        },
        sendOutput: {
          type: DataTypes.INTEGER(1),
          allowNull: true
        },
        level: {
          type: DataTypes.DOUBLE,
          allowNull: true
        },
        server: {
          type: DataTypes.INTEGER(11),
          allowNull: true
        }
      },
      {
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci'
      }
    );

  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
