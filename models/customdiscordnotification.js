/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('customdiscordnotification', {
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
  }, {
    sequelize,
    tableName: 'customdiscordnotification'
  });
};
