/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('usagestats', {
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
  }, {
    sequelize,
    tableName: 'usagestats'
  });
};
