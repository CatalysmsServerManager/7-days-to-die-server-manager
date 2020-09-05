/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('sdtdconfig', {
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
  }, {
    sequelize,
    tableName: 'sdtdconfig'
  });
};
