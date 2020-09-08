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


    queryInterface.createTable(
      'customcommandargument',
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
        key: {
          type: DataTypes.STRING(255),
          allowNull: true
        },
        type: {
          type: DataTypes.STRING(255),
          allowNull: true
        },
        allowedValues: {
          type: 'LONGTEXT',
          allowNull: true
        },
        required: {
          type: DataTypes.INTEGER(1),
          allowNull: true
        },
        defaultValue: {
          type: DataTypes.STRING(255),
          allowNull: true
        },
        command: {
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
      'customdiscordnotification',
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
        stringToSearchFor: {
          type: DataTypes.STRING(255),
          allowNull: true
        },
        discordChannelId: {
          type: DataTypes.STRING(255),
          allowNull: true
        },
        enabled: {
          type: DataTypes.INTEGER(1),
          allowNull: true
        },
        ignoreServerChat: {
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
      'customhook',
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
        event: {
          type: DataTypes.STRING(255),
          allowNull: true
        },
        commandsToExecute: {
          type: DataTypes.STRING(255),
          allowNull: true
        },
        searchString: {
          type: DataTypes.STRING(255),
          allowNull: true
        },
        regex: {
          type: DataTypes.STRING(255),
          allowNull: true
        },
        cooldown: {
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
      'gblcomment_heartedBy__user_heartedGblComment',
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER(11),
          allowNull: false,
          primaryKey: true
        },
        gblcomment_heartedBy: {
          type: DataTypes.INTEGER(11),
          allowNull: true
        },
        user_heartedGblComment: {
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
      'gblcomment',
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
        content: {
          type: DataTypes.STRING(255),
          allowNull: true
        },
        deleted: {
          type: DataTypes.INTEGER(1),
          allowNull: true
        },
        user: {
          type: DataTypes.INTEGER(11),
          allowNull: true
        },
        ban: {
          type: DataTypes.INTEGER(11),
          allowNull: true
        },
      },
      {
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci'
      }
    );
    queryInterface.createTable(
      'gimmeitem',
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
        value: {
          type: DataTypes.STRING(255),
          allowNull: true
        },
        friendlyName: {
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
      'historicalinfo',
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
        message: {
          type: DataTypes.STRING(255),
          allowNull: true
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
        amount: {
          type: DataTypes.DOUBLE,
          allowNull: true
        },
        economyAction: {
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
      'hookvariable',
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
        regex: {
          type: DataTypes.STRING(255),
          allowNull: true
        },
        name: {
          type: DataTypes.STRING(255),
          allowNull: true
        },
        hook: {
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
      'player',
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
        entityId: {
          type: DataTypes.DOUBLE,
          allowNull: true
        },
        ip: {
          type: DataTypes.STRING(255),
          allowNull: true
        },
        country: {
          type: DataTypes.STRING(255),
          allowNull: true
        },
        currency: {
          type: DataTypes.DOUBLE,
          allowNull: true
        },
        avatarUrl: {
          type: DataTypes.STRING(255),
          allowNull: true
        },
        name: {
          type: DataTypes.STRING(255),
          allowNull: true
        },
        positionX: {
          type: DataTypes.DOUBLE,
          allowNull: true
        },
        positionY: {
          type: DataTypes.DOUBLE,
          allowNull: true
        },
        positionZ: {
          type: DataTypes.DOUBLE,
          allowNull: true
        },
        inventory: {
          type: 'LONGTEXT',
          allowNull: true
        },
        playtime: {
          type: DataTypes.DOUBLE,
          allowNull: true
        },
        lastOnline: {
          type: DataTypes.STRING(255),
          allowNull: true
        },
        banned: {
          type: DataTypes.INTEGER(1),
          allowNull: true
        },
        deaths: {
          type: DataTypes.DOUBLE,
          allowNull: true
        },
        zombieKills: {
          type: DataTypes.DOUBLE,
          allowNull: true
        },
        playerKills: {
          type: DataTypes.DOUBLE,
          allowNull: true
        },
        score: {
          type: DataTypes.DOUBLE,
          allowNull: true
        },
        level: {
          type: DataTypes.DOUBLE,
          allowNull: true
        },
        lastTeleportTime: {
          type: 'LONGTEXT',
          allowNull: true
        },
        server: {
          type: DataTypes.INTEGER(11),
          allowNull: true
        },
        user: {
          type: DataTypes.INTEGER(11),
          allowNull: true
        },
        role: {
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
      'playerclaimitem',
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
        amount: {
          type: DataTypes.DOUBLE,
          allowNull: true
        },
        quality: {
          type: DataTypes.DOUBLE,
          allowNull: true
        },
        claimed: {
          type: DataTypes.INTEGER(1),
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
      'playerteleport',
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
        x: {
          type: DataTypes.DOUBLE,
          allowNull: true
        },
        y: {
          type: DataTypes.DOUBLE,
          allowNull: true
        },
        z: {
          type: DataTypes.DOUBLE,
          allowNull: true
        },
        public: {
          type: DataTypes.INTEGER(1),
          allowNull: true
        },
        timesUsed: {
          type: DataTypes.DOUBLE,
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
      'playerusedcommand',
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
      'playerusedgimme',
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
        item: {
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
      'role',
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
        level: {
          type: DataTypes.DOUBLE,
          allowNull: true
        },
        isDefault: {
          type: DataTypes.INTEGER(1),
          allowNull: true
        },
        amountOfTeleports: {
          type: DataTypes.DOUBLE,
          allowNull: true
        },
        radiusAllowedToExplore: {
          type: DataTypes.DOUBLE,
          allowNull: true
        },
        economyGiveMultiplier: {
          type: DataTypes.DOUBLE,
          allowNull: true
        },
        economyDeductMultiplier: {
          type: DataTypes.DOUBLE,
          allowNull: true
        },
        discordRole: {
          type: DataTypes.STRING(255),
          allowNull: true
        },
        manageServer: {
          type: DataTypes.INTEGER(1),
          allowNull: true
        },
        manageEconomy: {
          type: DataTypes.INTEGER(1),
          allowNull: true
        },
        managePlayers: {
          type: DataTypes.INTEGER(1),
          allowNull: true
        },
        manageTickets: {
          type: DataTypes.INTEGER(1),
          allowNull: true
        },
        viewAnalytics: {
          type: DataTypes.INTEGER(1),
          allowNull: true
        },
        viewDashboard: {
          type: DataTypes.INTEGER(1),
          allowNull: true
        },
        useTracking: {
          type: DataTypes.INTEGER(1),
          allowNull: true
        },
        useChat: {
          type: DataTypes.INTEGER(1),
          allowNull: true
        },
        useCommands: {
          type: DataTypes.INTEGER(1),
          allowNull: true
        },
        manageGbl: {
          type: DataTypes.INTEGER(1),
          allowNull: true
        },
        discordExec: {
          type: DataTypes.INTEGER(1),
          allowNull: true
        },
        discordLookup: {
          type: DataTypes.INTEGER(1),
          allowNull: true
        },
        immuneToBannedItemsList: {
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
      'sdtdconfig',
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
        inactive: {
          type: DataTypes.INTEGER(1),
          allowNull: true
        },
        inventoryTracking: {
          type: DataTypes.INTEGER(1),
          allowNull: true
        },
        locationTracking: {
          type: DataTypes.INTEGER(1),
          allowNull: true
        },
        economyEnabled: {
          type: DataTypes.INTEGER(1),
          allowNull: true
        },
        currencyName: {
          type: DataTypes.STRING(255),
          allowNull: true
        },
        killEarnerEnabled: {
          type: DataTypes.INTEGER(1),
          allowNull: true
        },
        zombieKillReward: {
          type: DataTypes.DOUBLE,
          allowNull: true
        },
        playerKillReward: {
          type: DataTypes.DOUBLE,
          allowNull: true
        },
        playtimeEarnerEnabled: {
          type: DataTypes.INTEGER(1),
          allowNull: true
        },
        playtimeEarnerInterval: {
          type: DataTypes.DOUBLE,
          allowNull: true
        },
        playtimeEarnerAmount: {
          type: DataTypes.DOUBLE,
          allowNull: true
        },
        discordTextEarnerEnabled: {
          type: DataTypes.INTEGER(1),
          allowNull: true
        },
        discordTextEarnerAmountPerMessage: {
          type: DataTypes.DOUBLE,
          allowNull: true
        },
        discordTextEarnerTimeout: {
          type: DataTypes.DOUBLE,
          allowNull: true
        },
        discordTextEarnerIgnoredChannels: {
          type: 'LONGTEXT',
          allowNull: true
        },
        costToTeleport: {
          type: DataTypes.DOUBLE,
          allowNull: true
        },
        costToSetTeleport: {
          type: DataTypes.DOUBLE,
          allowNull: true
        },
        costToMakeTeleportPublic: {
          type: DataTypes.DOUBLE,
          allowNull: true
        },
        costToUseGimme: {
          type: DataTypes.DOUBLE,
          allowNull: true
        },
        commandsEnabled: {
          type: DataTypes.INTEGER(1),
          allowNull: true
        },
        commandPrefix: {
          type: DataTypes.STRING(255),
          allowNull: true
        },
        enabledCallAdmin: {
          type: DataTypes.INTEGER(1),
          allowNull: true
        },
        enabledPlayerTeleports: {
          type: DataTypes.INTEGER(1),
          allowNull: true
        },
        enabledWho: {
          type: DataTypes.INTEGER(1),
          allowNull: true
        },
        enabledGimme: {
          type: DataTypes.INTEGER(1),
          allowNull: true
        },
        maxPlayerTeleportLocations: {
          type: DataTypes.DOUBLE,
          allowNull: true
        },
        playerTeleportDelay: {
          type: DataTypes.DOUBLE,
          allowNull: true
        },
        playerTeleportTimeout: {
          type: DataTypes.DOUBLE,
          allowNull: true
        },
        gimmeCooldown: {
          type: DataTypes.DOUBLE,
          allowNull: true
        },
        discordPrefix: {
          type: DataTypes.STRING(255),
          allowNull: true
        },
        discordGuildId: {
          type: DataTypes.STRING(255),
          allowNull: true
        },
        chatChannelId: {
          type: DataTypes.STRING(255),
          allowNull: true
        },
        chatChannelRichMessages: {
          type: DataTypes.INTEGER(1),
          allowNull: true
        },
        chatChannelGlobalOnly: {
          type: DataTypes.INTEGER(1),
          allowNull: true
        },
        chatChannelBlockedPrefixes: {
          type: 'LONGTEXT',
          allowNull: true
        },
        discordNotificationConfig: {
          type: 'LONGTEXT',
          allowNull: true
        },
        gblNotificationBans: {
          type: DataTypes.DOUBLE,
          allowNull: true
        },
        gblAutoBanEnabled: {
          type: DataTypes.INTEGER(1),
          allowNull: true
        },
        gblAutoBanBans: {
          type: DataTypes.DOUBLE,
          allowNull: true
        },
        loggingEnabled: {
          type: DataTypes.INTEGER(1),
          allowNull: true
        },
        memUpdateInfoEnabled: {
          type: DataTypes.INTEGER(1),
          allowNull: true
        },
        countryBanConfig: {
          type: 'LONGTEXT',
          allowNull: true
        },
        pingKickEnabled: {
          type: DataTypes.INTEGER(1),
          allowNull: true
        },
        maxPing: {
          type: DataTypes.DOUBLE,
          allowNull: true
        },
        pingChecksToFail: {
          type: DataTypes.DOUBLE,
          allowNull: true
        },
        pingKickMessage: {
          type: DataTypes.STRING(255),
          allowNull: true
        },
        pingWhitelist: {
          type: 'LONGTEXT',
          allowNull: true
        },
        votingApiKey: {
          type: DataTypes.STRING(255),
          allowNull: true
        },
        votingEnabled: {
          type: DataTypes.INTEGER(1),
          allowNull: true
        },
        votingCommand: {
          type: DataTypes.STRING(255),
          allowNull: true
        },
        bannedItemsEnabled: {
          type: DataTypes.INTEGER(1),
          allowNull: true
        },
        bannedItems: {
          type: 'LONGTEXT',
          allowNull: true
        },
        bannedItemsCommand: {
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
      'sdtdserver_admins__user_adminOf',
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER(11),
          allowNull: false,
          primaryKey: true
        },
        sdtdserver_admins: {
          type: DataTypes.INTEGER(11),
          allowNull: true
        },
        user_adminOf: {
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
      'sdtdticket',
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
        description: {
          type: DataTypes.STRING(255),
          allowNull: true
        },
        title: {
          type: DataTypes.STRING(255),
          allowNull: true
        },
        status: {
          type: DataTypes.INTEGER(1),
          allowNull: true
        },
        playerInfo: {
          type: 'LONGTEXT',
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
      'shoplisting',
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
        friendlyName: {
          type: DataTypes.STRING(255),
          allowNull: true
        },
        iconName: {
          type: DataTypes.STRING(255),
          allowNull: true
        },
        amount: {
          type: DataTypes.DOUBLE,
          allowNull: true
        },
        quality: {
          type: DataTypes.DOUBLE,
          allowNull: true
        },
        price: {
          type: DataTypes.DOUBLE,
          allowNull: true
        },
        timesBought: {
          type: DataTypes.DOUBLE,
          allowNull: true
        },
        server: {
          type: DataTypes.INTEGER(11),
          allowNull: true
        },
        createdBy: {
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
      'ticketcomment',
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
        commentText: {
          type: DataTypes.TEXT,
          allowNull: true
        },
        ticket: {
          type: DataTypes.INTEGER(11),
          allowNull: true
        },
        userThatPlacedTheComment: {
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
      'trackinginfo',
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
        x: {
          type: DataTypes.DOUBLE,
          allowNull: true
        },
        y: {
          type: DataTypes.DOUBLE,
          allowNull: true
        },
        z: {
          type: DataTypes.DOUBLE,
          allowNull: true
        },
        inventory: {
          type: 'LONGTEXT',
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
      'usagestats',
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
        discordGuilds: {
          type: DataTypes.DOUBLE,
          allowNull: true
        },
        discordUsers: {
          type: DataTypes.DOUBLE,
          allowNull: true
        },
        servers: {
          type: DataTypes.DOUBLE,
          allowNull: true
        },
        players: {
          type: DataTypes.DOUBLE,
          allowNull: true
        },
        teleportLocations: {
          type: DataTypes.DOUBLE,
          allowNull: true
        },
        timesTeleported: {
          type: DataTypes.DOUBLE,
          allowNull: true
        },
        customCommands: {
          type: DataTypes.DOUBLE,
          allowNull: true
        },
        customCommandsUsed: {
          type: DataTypes.DOUBLE,
          allowNull: true
        },
        chatBridges: {
          type: DataTypes.DOUBLE,
          allowNull: true
        },
        countryBans: {
          type: DataTypes.DOUBLE,
          allowNull: true
        },
        ingameCommands: {
          type: DataTypes.DOUBLE,
          allowNull: true
        },
        gblEntries: {
          type: DataTypes.DOUBLE,
          allowNull: true
        },
        cronJobs: {
          type: DataTypes.DOUBLE,
          allowNull: true
        },
        pingKickers: {
          type: DataTypes.DOUBLE,
          allowNull: true
        },
        openTickets: {
          type: DataTypes.DOUBLE,
          allowNull: true
        },
        closedTickets: {
          type: DataTypes.DOUBLE,
          allowNull: true
        },
        gblComments: {
          type: DataTypes.DOUBLE,
          allowNull: true
        }
      },
      {
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci'
      }
    );
    queryInterface.createTable(
      'user',
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
          allowNull: true,
          unique: true
        },
        discordId: {
          type: DataTypes.STRING(255),
          allowNull: true
        },
        username: {
          type: DataTypes.STRING(255),
          allowNull: true
        },
        avatar: {
          type: DataTypes.STRING(255),
          allowNull: true
        },
        admin: {
          type: DataTypes.INTEGER(1),
          allowNull: true
        },
        banned: {
          type: DataTypes.INTEGER(1),
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
    // Drop schema I guess?
  }
};
