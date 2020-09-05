/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('role', {
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
  }, {
    sequelize,
    tableName: 'role'
  });
};
