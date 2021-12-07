'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const {DataTypes} = Sequelize;
    await queryInterface.createTable(
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
          unique: true,
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
          type: DataTypes.TINYINT(1),
          allowNull: true
        },
        banned: {
          type: DataTypes.TINYINT(1),
          allowNull: true
        }
      },
      {
        charset: 'latin1'
      }
    );

    await queryInterface.createTable(
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
          unique: true,
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
        charset: 'latin1'
      }
    );

    await queryInterface.createTable(
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
          unique: true,
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
        charset: 'latin1'
      }
    );


    await queryInterface.createTable(
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
          unique: true,
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
          type: DataTypes.TINYINT(1),
          allowNull: true
        },
        server: {
          type: DataTypes.INTEGER(11),
          allowNull: true
        }
      },
      {
        charset: 'latin1'
      }
    );


    await queryInterface.createTable(
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
          unique: true,
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
        charset: 'latin1'
      }
    );

    await queryInterface.createTable(
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
          unique: true,
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
        charset: 'latin1'
      }
    );


    await queryInterface.createTable(
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
          unique: true,
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
          type: DataTypes.TINYINT(1),
          allowNull: true
        },
        notificationEnabled: {
          type: DataTypes.TINYINT(1),
          allowNull: true
        },
        server: {
          type: DataTypes.INTEGER(11),
          allowNull: true
        }
      },
      {
        charset: 'latin1'
      }
    );


    await queryInterface.createTable(
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
          unique: true,
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
          type: DataTypes.TINYINT(1),
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
          type: DataTypes.TINYINT(1),
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
        charset: 'latin1'
      }
    );


    await queryInterface.createTable(
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
          unique: true,
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
          type: DataTypes.TINYINT(1),
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
        charset: 'latin1'
      }
    );

    await queryInterface.createTable(
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
          unique: true,
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
          type: DataTypes.TINYINT(1),
          allowNull: true
        },
        ignoreServerChat: {
          type: DataTypes.TINYINT(1),
          allowNull: true
        },
        server: {
          type: DataTypes.INTEGER(11),
          allowNull: true
        }
      },
      {
        charset: 'latin1'
      }
    );
    await queryInterface.createTable(
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
          unique: true,
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
        charset: 'latin1'
      }
    );
    await queryInterface.createTable(
      'gblcomment_heartedBy__user_heartedGblComment',
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER(11),
          unique: true,
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
        charset: 'latin1'
      }
    );
    await queryInterface.createTable(
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
          unique: true,
          allowNull: false,
          primaryKey: true
        },
        content: {
          type: DataTypes.STRING(255),
          allowNull: true
        },
        deleted: {
          type: DataTypes.TINYINT(1),
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
        charset: 'latin1'
      }
    );
    await queryInterface.createTable(
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
          unique: true,
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
        charset: 'latin1'
      }
    );
    await queryInterface.createTable(
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
          unique: true,
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
        charset: 'latin1'
      }
    );
    await queryInterface.createTable(
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
          unique: true,
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
        charset: 'latin1'
      }
    );
    await queryInterface.createTable(
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
          unique: true,
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
          type: DataTypes.TINYINT(1),
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
        charset: 'latin1'
      }
    );
    await queryInterface.createTable(
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
          unique: true,
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
          type: DataTypes.TINYINT(1),
          allowNull: true
        },
        player: {
          type: DataTypes.INTEGER(11),
          allowNull: true
        }
      },
      {
        charset: 'latin1'
      }
    );
    await queryInterface.createTable(
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
          unique: true,
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
          type: DataTypes.TINYINT(1),
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
        charset: 'latin1'
      }
    );
    await queryInterface.createTable(
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
          unique: true,
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
        charset: 'latin1'
      }
    );
    await queryInterface.createTable(
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
          unique: true,
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
        charset: 'latin1'
      }
    );
    await queryInterface.createTable(
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
          unique: true,
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
          type: DataTypes.TINYINT(1),
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
          type: DataTypes.TINYINT(1),
          allowNull: true
        },
        manageEconomy: {
          type: DataTypes.TINYINT(1),
          allowNull: true
        },
        managePlayers: {
          type: DataTypes.TINYINT(1),
          allowNull: true
        },
        manageTickets: {
          type: DataTypes.TINYINT(1),
          allowNull: true
        },
        viewAnalytics: {
          type: DataTypes.TINYINT(1),
          allowNull: true
        },
        viewDashboard: {
          type: DataTypes.TINYINT(1),
          allowNull: true
        },
        useTracking: {
          type: DataTypes.TINYINT(1),
          allowNull: true
        },
        useChat: {
          type: DataTypes.TINYINT(1),
          allowNull: true
        },
        useCommands: {
          type: DataTypes.TINYINT(1),
          allowNull: true
        },
        manageGbl: {
          type: DataTypes.TINYINT(1),
          allowNull: true
        },
        discordExec: {
          type: DataTypes.TINYINT(1),
          allowNull: true
        },
        discordLookup: {
          type: DataTypes.TINYINT(1),
          allowNull: true
        },
        immuneToBannedItemsList: {
          type: DataTypes.TINYINT(1),
          allowNull: true
        },
        server: {
          type: DataTypes.INTEGER(11),
          allowNull: true
        }
      },
      {
        charset: 'latin1'
      }
    );
    await queryInterface.createTable(
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
          unique: true,
          allowNull: false,
          primaryKey: true
        },
        inactive: {
          type: DataTypes.TINYINT(1),
          allowNull: true
        },
        inventoryTracking: {
          type: DataTypes.TINYINT(1),
          allowNull: true
        },
        locationTracking: {
          type: DataTypes.TINYINT(1),
          allowNull: true
        },
        economyEnabled: {
          type: DataTypes.TINYINT(1),
          allowNull: true
        },
        currencyName: {
          type: DataTypes.STRING(255),
          allowNull: true
        },
        killEarnerEnabled: {
          type: DataTypes.TINYINT(1),
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
          type: DataTypes.TINYINT(1),
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
          type: DataTypes.TINYINT(1),
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
          type: DataTypes.TINYINT(1),
          allowNull: true
        },
        commandPrefix: {
          type: DataTypes.STRING(255),
          allowNull: true
        },
        enabledCallAdmin: {
          type: DataTypes.TINYINT(1),
          allowNull: true
        },
        enabledPlayerTeleports: {
          type: DataTypes.TINYINT(1),
          allowNull: true
        },
        enabledWho: {
          type: DataTypes.TINYINT(1),
          allowNull: true
        },
        enabledGimme: {
          type: DataTypes.TINYINT(1),
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
          type: DataTypes.TINYINT(1),
          allowNull: true
        },
        chatChannelGlobalOnly: {
          type: DataTypes.TINYINT(1),
          allowNull: true
        },
        chatChannelBlockedPrefixes: {
          type: 'LONGTEXT',
          allowNull: true
        },
        chatBridgeDCPrefix: {
          type: 'LONGTEXT',
          allowNull: true
        },
        chatBridgeDCSuffix: {
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
          type: DataTypes.TINYINT(1),
          allowNull: true
        },
        gblAutoBanBans: {
          type: DataTypes.DOUBLE,
          allowNull: true
        },
        loggingEnabled: {
          type: DataTypes.TINYINT(1),
          allowNull: true
        },
        memUpdateInfoEnabled: {
          type: DataTypes.TINYINT(1),
          allowNull: true
        },
        countryBanConfig: {
          type: 'LONGTEXT',
          allowNull: true
        },
        pingKickEnabled: {
          type: DataTypes.TINYINT(1),
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
          type: DataTypes.TINYINT(1),
          allowNull: true
        },
        votingCommand: {
          type: DataTypes.STRING(255),
          allowNull: true
        },
        bannedItemsEnabled: {
          type: DataTypes.TINYINT(1),
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
        charset: 'latin1'
      }
    );
    await queryInterface.createTable(
      'sdtdserver_admins__user_adminOf',
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER(11),
          unique: true,
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
        charset: 'latin1'
      }
    );
    await queryInterface.createTable(
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
          unique: true,
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
        charset: 'latin1'
      }
    );
    await queryInterface.createTable(
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
          unique: true,
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
          type: DataTypes.TINYINT(1),
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
        charset: 'latin1'
      }
    );
    await queryInterface.createTable(
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
          unique: true,
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
        charset: 'latin1'
      }
    );
    await queryInterface.createTable(
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
          unique: true,
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
        charset: 'latin1'
      }
    );
    await queryInterface.createTable(
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
          unique: true,
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
        charset: 'latin1'
      }
    );
    await queryInterface.createTable(
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
          unique: true,
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
        charset: 'latin1'
      }
    );
    await queryInterface.createTable(
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
          unique: true,
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
          type: DataTypes.TINYINT(1),
          allowNull: true
        },
        banned: {
          type: DataTypes.TINYINT(1),
          allowNull: true
        }
      },
      {
        charset: 'latin1'
      }
    );

    await queryInterface.createTable(
      'archive',
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER(11),
          unique: true,
          allowNull: false,
          primaryKey: true
        },
        createdAt: {
          type: DataTypes.BIGINT,
          allowNull: true
        },
        fromModel: {
          type: DataTypes.STRING(255),
          allowNull: true
        },
        originalRecord: {
          type: 'LONGTEXT',
          allowNull: true
        },
        originalRecordId: {
          type: 'LONGTEXT',
          allowNull: true
        }
      },
      {
        charset: 'latin1'
      }
    );

  },

  down: async (queryInterface, Sequelize) => {
    // Drop schema I guess?
  }
};
